// ============================
// WATCHLIST – PROFILE
// ============================

// Obtener token
const token = localStorage.getItem("token");

// Redirigir si no hay sesión
if (!token) {
    window.location.href = "../../PW Login/PW_Login.html";
}

// Contenedor donde se mostrarán las películas
const watchlistContainer = document.getElementById("watchlist-container");

// ============================
// Cargar Watchlist del usuario
// ============================
async function loadWatchlist() {
    try {
        const res = await fetch("http://localhost:3000/watchlist", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!data.success || data.data.length === 0) {
            watchlistContainer.innerHTML = `
                <p class="empty-text">Tu watchlist está vacía.</p>
            `;
            return;
        }

        renderWatchlist(data.data);

    } catch (error) {
        console.error("Error cargando watchlist:", error);
    }
}

// ============================
// Renderizar tarjetas
// ============================
function renderWatchlist(list) {
    watchlistContainer.innerHTML = "";

    list.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${item.poster}" class="movie-poster" alt="${item.movie_title}">
            <h4 class="movie-title">${item.movie_title}</h4>

            <button class="remove-btn" data-id="${item.id}">
                Eliminar
            </button>
        `;

        watchlistContainer.appendChild(card);
    });

    // Activar botones de eliminar
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteWatchlistItem(btn.dataset.id);
        });
    });
}

// ============================
// Eliminar película de watchlist
// ============================
async function deleteWatchlistItem(id) {
    try {
        const res = await fetch(`http://localhost:3000/watchlist/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.success) {
            loadWatchlist(); // Recargar lista
        }
    } catch (error) {
        console.error("Error eliminando:", error);
    }
}

// Ejecutar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", loadWatchlist);
