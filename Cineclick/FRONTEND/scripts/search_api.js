// search_api.js

// **UTILIZA TU CLAVE API DE TMDb**
const API_KEY = '65f588c6445a775c9a45fed2ecb97ae4'; 
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const genreButtons = document.querySelectorAll('.btn-genre');
const resultsContainer = document.getElementById('searchResultsContainer');

// Lista de IDs de géneros actualmente activos
let activeGenreIds = [];

// --- UTILERÍA ---

// Función para generar el HTML de un cartel de película (similar al de Home)
function createMovieCard(movie) {
    // Mostrar solo el promedio local si existe, si no 'Sin calificaciones'
    const ratings = JSON.parse(localStorage.getItem('movie_ratings') || '{}');
    const avg = ratings[movie.id];
    let starsHtml = '';
    if (avg) {
        starsHtml = `<span class='ms-1 text-dark'>${avg.toFixed(1)}/10</span>`;
    } else {
        starsHtml = '<span class="text-secondary">Sin calificaciones</span>';
    }
    
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Poster';

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
                        <div class="stars justify-content-center">
                            ${starsHtml}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Muestra los resultados en el contenedor
function displayResults(movies) {
    if (movies.length === 0) {
        resultsContainer.innerHTML = '<p class="text-secondary ps-3">No se encontraron resultados que coincidan con los criterios.</p>';
        return;
    }
    
    let htmlContent = '';
    movies.forEach(movie => {
        // Solo mostramos películas con póster para una mejor UX
        if (movie.poster_path) {
            htmlContent += createMovieCard(movie);
        }
    });
    
    resultsContainer.innerHTML = htmlContent;
}

// --- LÓGICA DE BÚSQUEDA Y FILTRADO ---

// Función que realiza la llamada a la API
async function performSearch() {
    const query = searchInput.value.trim();
    let url;
    
    resultsContainer.innerHTML = '<div class="spinner-border text-primary ms-3" role="status"><span class="visually-hidden">Loading...</span></div>';

    // 1. Determinar el Endpoint: ¿Búsqueda por texto o Discovery por género?
    if (query) {
        // Búsqueda por texto (query)
        url = `${BASE_URL}search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    } else if (activeGenreIds.length > 0) {
        // Búsqueda por Discovery (géneros)
        const genres = activeGenreIds.join(',');
        url = `${BASE_URL}discover/movie?api_key=${API_KEY}&with_genres=${genres}&language=es-ES&sort_by=popularity.desc`;
    } else {
        // Si no hay texto ni filtros, mostramos las películas populares por defecto
        url = `${BASE_URL}movie/popular?api_key=${API_KEY}&language=es-ES`;
    }

    // 2. Ejecutar la Petición
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        displayResults(data.results);

    } catch (error) {
        console.error('Error durante la búsqueda:', error);
        resultsContainer.innerHTML = '<p class="text-danger ps-3">Ocurrió un error al cargar los resultados. Inténtalo de nuevo.</p>';
    }
}

// --- EVENT LISTENERS ---

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Interacción de Búsqueda por Botón
    searchButton.addEventListener('click', () => {
        performSearch();
    });

    // Permitir búsqueda al presionar ENTER en el input
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // 2. Interacción de Filtros por Género
    genreButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const genreId = this.getAttribute('data-genre-id');

            // Actualizar la lista de géneros activos
            if (this.classList.contains('active')) {
                activeGenreIds.push(genreId);
            } else {
                activeGenreIds = activeGenreIds.filter(id => id !== genreId);
            }
            
            // Forzar la búsqueda si se activa/desactiva un filtro, incluso si el campo de búsqueda está vacío
            performSearch();
        });
    });

    // 3. Lógica de Logout (Mantenida)
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
    
    // Cargar resultados iniciales (populares por defecto)
    performSearch();
});