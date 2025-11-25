// ======================================================
// TAGS PERSONALIZADOS POR PELÍCULA
// ======================================================
async function getTagsByMovie(movieId) {
    try {
        const res = await fetch(`${API_URL}/tags?movie_id=${movieId}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("Error obteniendo tags:", err);
        return [];
    }
}

async function createTagForMovie(movieId, name) {
    try {
        const res = await fetch(`${API_URL}/tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth": AUTH_KEY
            },
            body: JSON.stringify({ name, movie_id: movieId })
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }
        return await res.json();
    } catch (err) {
        alert("Error al crear tag: " + err.message);
        return null;
    }
}

async function deleteTag(tagId) {
    try {
        const res = await fetch(`${API_URL}/tags/${tagId}`, {
            method: "DELETE",
            headers: { "x-auth": AUTH_KEY }
        });
        return res.ok;
    } catch (err) {
        alert("Error al eliminar tag");
        return false;
    }
}
// ======================================================
// WATCHLIST.JS — Manejo completo del Watchlist real
// Usa "user_auth_key" como token oficial
// ======================================================

const API_URL = "http://127.0.0.1:3000";

// ------------------------------------------
// Obtener datos de sesión
// ------------------------------------------
const USER_ID = localStorage.getItem("user_id");
const AUTH_KEY = localStorage.getItem("user_auth_key");

if (!USER_ID || !AUTH_KEY) {
    console.warn("⚠ No hay sesión activa.");
}

// ======================================================
// 1) AGREGAR PELÍCULA AL WATCHLIST
// ======================================================
async function addToWatchlist(movieId) {
    try {
        const response = await fetch(`${API_URL}/watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth": AUTH_KEY
            },
            body: JSON.stringify({ movie_id: movieId })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error al agregar:", error);
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error al conectar:", err);
        return false;
    }
}

// ======================================================
// 2) ELIMINAR PELÍCULA DE WATCHLIST
// ======================================================
async function removeFromWatchlist(itemId) {
    try {
        const response = await fetch(`${API_URL}/watchlist/${itemId}`, {
            method: "DELETE",
            headers: { "x-auth": AUTH_KEY }
        });

        return response.ok;

    } catch (err) {
        console.error("Error al eliminar:", err);
        return false;
    }
}

// ======================================================
// 3) OBTENER WATCHLIST COMPLETO DEL USUARIO
// ======================================================
async function getUserWatchlist() {
    try {
        const response = await fetch(`${API_URL}/watchlist`, {
            headers: { "x-auth": AUTH_KEY }
        });

        if (!response.ok) return [];

        return await response.json();

    } catch (err) {
        console.error("Error obteniendo watchlist:", err);
        return [];
    }
}

// ======================================================
// 4) RENDERIZAR WATCHLIST EN PROFILE
// ======================================================
async function renderWatchlist() {
    const container = document.getElementById("reviewsContainer"); // donde van reviews/watchlist
    if (!container) return;

    container.innerHTML = "<h3 class='mb-3 text-duke fw-bold'>Watchlist</h3>";

    const watchlist = await getUserWatchlist();

    if (watchlist.length === 0) {
        container.innerHTML += `
            <p class="text-center text-dark mt-3">No tienes películas en tu Watchlist.</p>
        `;
        return;
    }

    watchlist.forEach(item => {
        container.innerHTML += `
            <div class="review-card position-relative">
                <img src="${item.movie.poster}" class="review-poster">
                
                <div class="review-body">
                    <h5 class="review-title">${item.movie.title}</h5>
                    <p class="review-text">${item.movie.overview || "Sin descripción disponible."}</p>
                </div>

                <div class="review-actions">
                    <i class="fas fa-trash" onclick="removeFromWatchlistUI('${item._id || item.id}')"></i>
                </div>
            </div>
        `;
    });
}

// ======================================================
// 5) ELIMINAR DESDE LA UI (PROFILE)
// ======================================================
async function removeFromWatchlistUI(id) {
    if (!confirm("¿Eliminar esta película del watchlist?")) return;

    const ok = await removeFromWatchlist(id);
    if (ok) {
        renderWatchlist();
    }
}

// ======================================================
// 6) BOTÓN WATCHLIST EN PROFILE
// ======================================================
document.getElementById("btnLikes")?.addEventListener("click", () => {
    document.getElementById("reviewsContainer").style.display = "block";
    document.getElementById("commentsContainer").style.display = "none";
    renderWatchlist();
});

// ======================================================
// 7) FUNCIÓN PARA MOVIE.HTML → Toggle del corazón
// ======================================================
async function toggleWatchlistFromMovie(movieId) {
    const watchlist = await getUserWatchlist();
    const existing = watchlist.find(item => item.movie_id == movieId);

    if (!existing) {
        const ok = await addToWatchlist(movieId);
        return ok;
    } else {
        // Usar el identificador correcto de MongoDB (_id) o id
        const ok = await removeFromWatchlist(existing._id || existing.id);
        return ok;
    }
}
