// home_api.js


const API_KEY = '65f588c6445a775c9a45fed2ecb97ae4'; 
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// IDs de películas de ejemplo de TMDb para las secciones
const MOVIE_IDS = {
    // Usamos 'popular' y 'upcoming' como listas de ejemplo para variar
    'forYou': [105, 157336, 12, 100, 290859], 
    'trends': [1011985, 872585, 763215, 693134, 466420] 
};

// Función para generar el HTML de un cartel de película

// function createMovieCard(movie) {
//     // Mostrar solo el promedio local si existe, si no 'Sin calificaciones'
//     const ratings = JSON.parse(localStorage.getItem('movie_ratings') || '{}');
//     const avg = ratings[movie.id];
//     let starsHtml = '';
//     if (avg) {
//         starsHtml = `<span class='ms-1 text-dark'>${avg.toFixed(1)}/10</span>`;
//     } else {
//         starsHtml = '<span class="text-secondary">Sin calificaciones</span>';
//     }
    
//     const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Poster';

//     return `
//         <div class="col">
//             <a href="PW_Movie.html?id=${movie.id}" class="text-decoration-none">
//                 <div class="card bg-transparent border-0 poster-card">
//                     <div class="thumbnail">
//                         <img src="${posterUrl}" 
//                              class="shadow-sm" 
//                              alt="${movie.title}">
//                     </div>
//                     <div class="card-body p-2 text-center">
//                         <p class="film-title fw-bold text-dark mb-1">${movie.title}</p>
//                         <div class="stars justify-content-center">
//                             ${starsHtml}
//                         </div>
//                     </div>
//                 </div>
//             </a>
//         </div>
//     `;
// }

function createMovieCard(movie) {

    const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Poster';

    return `
        <div class="col">
            <a href="PW_Movie.html?id=${movie.id}" class="text-decoration-none">
                <div class="card bg-transparent border-0 poster-card">
                    <div class="thumbnail">
                        <img src="${posterUrl}" 
                             class="shadow-sm" 
                             alt="${movie.title}">
                    </div>

                    <div class="card-body p-2 text-center">
                        <p class="film-title fw-bold text-dark mb-1">${movie.title}</p>

                        <!-- Este contenedor se actualizará luego -->
                        <div class="stars justify-content-center" id="rating-${movie.id}">
                            <span class="text-secondary">Cargando...</span>
                        </div>
                    </div>

                </div>
            </a>
        </div>
    `;
}

async function getAverageRating(movieId) {
    try {
        const res = await fetch(`http://localhost:3000/api/reviews/by-movie?movieId=${movieId}`);
        if (!res.ok) return null;

        const reviews = await res.json();
        if (reviews.length === 0) return null;

        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return sum / reviews.length;

    } catch (err) {
        console.error("Error al obtener promedio:", err);
        return null;
    }
}


// Función principal para cargar películas por IDs
// async function loadMoviesSection(containerId, movieIds) {
//     const container = document.getElementById(containerId);
//     let htmlContent = '';
    
//     // Limpia el contenido de "Cargando..." y añade el spinner mientras carga
//     container.innerHTML = '<div class="spinner-border text-primary ms-3" role="status"><span class="visually-hidden">Loading...</span></div>';

//     loadMoviesSection('forYouContainer', MOVIE_IDS.forYou);

//     for (const id of movieIds) {
//         const url = `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=es-ES`;
//         try {
//             const response = await fetch(url);
//             if (!response.ok) throw new Error(`Error al cargar la película ${id}`);
//             const movie = await response.json();
//             htmlContent += createMovieCard(movie);
//         } catch (error) {
//             console.error(`Error al cargar la película ID ${id}:`, error);
//             htmlContent += `<div class="col"><p class="text-danger small">Error ID: ${id}</p></div>`;
//         }
//     }
//     container.innerHTML = htmlContent;
// }
async function loadMoviesSection(containerId, movieIds) {
    const container = document.getElementById(containerId);
    let htmlContent = '';
    
    // Spinner mientras carga
    container.innerHTML = '<div class="spinner-border text-primary ms-3" role="status"><span class="visually-hidden">Loading...</span></div>';

    // Cargar películas una por una
    for (const id of movieIds) {
        const url = `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=es-ES`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar la película ${id}`);
            const movie = await response.json();
            htmlContent += createMovieCard(movie);
        } catch (error) {
            console.error(`Error al cargar la película ID ${id}:`, error);
            htmlContent += `<div class="col"><p class="text-danger small">Error ID: ${id}</p></div>`;
        }
    }

    // Insertar las tarjetas en el DOM
    container.innerHTML = htmlContent;

    // === PASO 3 === Obtener promedio real desde MongoDB y pintarlo
    movieIds.forEach(async (id) => {
        const avg = await getAverageRating(id);
        const ratingDiv = document.getElementById(`rating-${id}`);

        if (!ratingDiv) return;

        if (!avg) {
            ratingDiv.innerHTML = `<span class="text-secondary">Sin calificaciones</span>`;
        } else {
            ratingDiv.innerHTML = `<span class="ms-1 text-dark">${avg.toFixed(1)}/10</span>`;
        }
    });
}


// Lógica de carga y eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // Iniciar la carga de las dos secciones de películas
    loadMoviesSection('forYouContainer', MOVIE_IDS.forYou);
    loadMoviesSection('trendsContainer', MOVIE_IDS.trends);
    
    // Lógica de Logout (Mantenida)
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModalElement = document.getElementById("modalLogout");
    
    if (logoutBtn && logoutModalElement) {
        const logoutModal = new bootstrap.Modal(logoutModalElement);
        const confirmLogout = document.getElementById("confirmLogout");

        logoutBtn.addEventListener("click", () => logoutModal.show());

        if (confirmLogout) {
            confirmLogout.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "PW_login.html";
            });
        }
    }
});