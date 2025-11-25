const API_KEY = "65f588c6445a775c9a45fed2ecb97ae4";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function loadUserReviews() {
    const token = localStorage.getItem("user_auth_key");

    const response = await fetch("http://127.0.0.1:3000/api/reviews", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth": token
        }
    });

    const data = await response.json();
    console.log("Respuesta real del backend:", data); // <-- IMPORTANTE

    displayReviews(data); // <-- por ahora lo pasamos completo
}




async function displayReviews(data) {
    const reviews = data;
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = "";

    for (const review of reviews) {

        const posterUrl = await getMoviePoster(review.movie_id);

        const card = document.createElement("div");
        card.className = "review-card position-relative";

        card.innerHTML = `
            <img src="${posterUrl}" 
                 alt="Poster" 
                 class="review-poster">

            <div class="review-body">
                
                <div class="review-title">${review.title}</div>

                <p class="review-text">${review.description}</p>

               
            </div>

            
        `;
        card.addEventListener("click", () => {
            window.location.href = `http://localhost:3000/Cineclick/FRONTEND/views/PW_Movie.html?id=${review.movie_id}`;
        });

        container.appendChild(card);
    }
}


async function getMoviePoster(movieId) {
    const API_KEY = "65f588c6445a775c9a45fed2ecb97ae4";
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=es-ES`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        return movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "../assets/no-poster.png";

    } catch (err) {
        console.error("Error obteniendo poster:", err);
        return "../assets/no-poster.png";
    }
}

document.addEventListener("DOMContentLoaded", loadUserReviews);
