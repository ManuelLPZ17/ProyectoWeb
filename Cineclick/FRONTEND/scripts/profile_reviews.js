const API_KEY = "65f588c6445a775c9a45fed2ecb97ae4";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const reviewsContainer = document.getElementById("reviewsContainer");
const commentsContainer = document.getElementById("commentsContainer");
const btnReviews = document.getElementById("btnReviews");
const btnComments = document.getElementById("btnComments");

const token = localStorage.getItem("user_auth_key");
const userId = localStorage.getItem("user_id");

document.addEventListener("DOMContentLoaded", () => {
    loadUserReviews();
});

// =======================
// 1️⃣ Cargar reseñas
// =======================
async function loadUserReviews() {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/reviews", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token
            }
        });
        const data = await response.json();
        displayReviews(data);
    } catch (err) {
        console.error("Error cargando reseñas:", err);
    }
}

// =======================
// 2️⃣ Mostrar reseñas
// =======================
async function displayReviews(reviews) {
    reviewsContainer.innerHTML = "";
    commentsContainer.innerHTML = ""; // ocultamos comentarios al mostrar reseñas

    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>No tienes reseñas aún.</p>";
        return;
    }

    for (const review of reviews) {
        const posterUrl = await getMoviePoster(review.movie_id);

        const card = document.createElement("div");
        card.className = "review-card position-relative";

        card.innerHTML = `
            <img src="${posterUrl}" alt="Poster" class="review-poster">
            <div class="review-body">
                <div class="review-title">${review.title}</div>
                <p class="review-text">${review.description}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `PW_Movie.html?id=${review.movie_id}`;
        });

        reviewsContainer.appendChild(card);
    }
}

// =======================
// 3️⃣ Obtener poster de TMDb
// =======================
async function getMoviePoster(movieId) {
    const url = `${BASE_URL}${movieId}?api_key=${API_KEY}&language=es-ES`;
    try {
        const response = await fetch(url);
        const movie = await response.json();
        return movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : "../assets/no-poster.png";
    } catch (err) {
        console.error("Error obteniendo poster:", err);
        return "../assets/no-poster.png";
    }
}

// =======================
// 4️⃣ Cargar comentarios
// =======================
btnComments.addEventListener("click", async () => {
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/comments/user/${userId}`, {
            headers: { "x-auth": token }
        });
        const comments = await res.json();
        displayComments(comments);
    } catch (err) {
        console.error("Error cargando comentarios:", err);
    }
});

async function displayComments(comments) {
    commentsContainer.innerHTML = "";
    reviewsContainer.innerHTML = ""; // ocultamos reseñas al mostrar comentarios

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = "<p>No tienes comentarios aún.</p>";
        return;
    }

    for (const comment of comments) {
        const posterUrl = await getMoviePoster(comment.movie_id);

        const card = document.createElement("div");
        card.className = "review-card position-relative";

        card.innerHTML = `
            <img src="${posterUrl}" alt="Poster" class="review-poster">
            <div class="review-body">
                <p class="review-text">${comment.content}</p>
                <p class="review-user">En reseña ID: ${comment.id_review}</p>
            </div>
        `;

        // Al hacer click en el contenedor, ir a la página de la película
        card.addEventListener("click", () => {
            window.location.href = `PW_Movie.html?id=${comment.movie_id}`;
        });

        commentsContainer.appendChild(card);
    }
}


// =======================
// 5️⃣ Botón Reviews para recargar reseñas
// =======================
btnReviews.addEventListener("click", loadUserReviews);
