// ===============================
// CONFIG GENERAL
// ===============================
const API_URL = "http://127.0.0.1:3000/users";

// Sesión
const USER_ID = localStorage.getItem("user_id");
const AUTH_KEY = localStorage.getItem("user_auth_key");

// Validar sesión
if (!USER_ID || !AUTH_KEY) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    window.location.href = "../views/PW_Login.html";
}

// ===============================
// CARGAR DATOS DEL USUARIO
// ===============================
async function cargarDatosUsuario() {
    try {
        const response = await fetch(`${API_URL}/${USER_ID}`, {
            method: "GET",
            headers: { "x-auth": AUTH_KEY }
        });

        if (!response.ok) throw new Error("No se pudo cargar el usuario.");

        const user = await response.json();

        document.getElementById("nombreUsuario").value = user.name || "";
        document.getElementById("correoUsuario").value = user.email || "";

    } catch (err) {
        console.error(err);
        alert("Error cargando datos del usuario.");
    }
}

document.addEventListener("DOMContentLoaded", cargarDatosUsuario);

// ===============================
// GUARDAR CAMBIOS
// ===============================
document.getElementById("formConfiguracion").addEventListener("submit", async (event) => {
    event.preventDefault();

    const updateData = {};
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const correo = document.getElementById("correoUsuario").value.trim();
    const passActual = document.getElementById("passwordActual").value.trim();
    const passNueva = document.getElementById("passwordNueva").value.trim();

    if (nombre) updateData.name = nombre;
    if (correo) updateData.email = correo;

    if (passNueva.length > 0) {
        if (!passActual) {
            return alert("Para cambiar la contraseña debes ingresar tu contraseña actual.");
        }
        updateData.password = passNueva;
    }

    try {
        const response = await fetch(`${API_URL}/${USER_ID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-auth": AUTH_KEY
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Datos actualizados correctamente.");
        } else {
            alert("Error: " + result.message);
        }

    } catch (err) {
        console.error(err);
        alert("Error actualizando el usuario.");
    }
});


// ===============================
// ABRIR MODAL DE ELIMINAR CUENTA
// ===============================
document.getElementById("btnEliminarCuenta")?.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarCuenta"));
    modal.show();
});

// ===============================
// ELIMINAR CUENTA
// ===============================
document.getElementById("confirmDeleteAccount")?.addEventListener("click", async () => {

    try {
        const response = await fetch(`${API_URL}/${USER_ID}`, {
            method: "DELETE",
            headers: { "x-auth": AUTH_KEY }
        });

        if (response.ok) {
            alert("Cuenta eliminada correctamente.");
            localStorage.clear();
            window.location.href = "../views/PW_Login.html";
        } else {
            const result = await response.text();
            alert("Error: " + result);
        }

    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar la cuenta.");
    }
});


// ===============================
// ABRIR MODAL DE LOGOUT
// ===============================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("modalLogout"));
    modal.show();
});

document.getElementById("logoutBtn2")?.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("modalLogout"));
    modal.show();
});

// ===============================
// CONFIRMAR LOGOUT
// ===============================
document.getElementById("confirmLogout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../views/PW_Login.html";
});



// --- ELEMENTOS ---
const inputFoto = document.getElementById("inputFoto");
const fotoPerfil = document.getElementById("fotoPerfil");

// --- CARGAR FOTO DESDE LOCALSTORAGE SI EXISTE ---
document.addEventListener("DOMContentLoaded", () => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) {
        fotoPerfil.src = fotoGuardada;
    }
});

// --- CUANDO EL USUARIO SELECCIONA UNA FOTO ---
inputFoto.addEventListener("change", function () {
    const archivo = this.files[0];
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function (e) {
        const imagenBase64 = e.target.result;

        // 1. Mostrar la imagen en pantalla
        fotoPerfil.src = imagenBase64;

        // 2. Guardarla en localStorage
        localStorage.setItem("fotoPerfil", imagenBase64);
    };

    lector.readAsDataURL(archivo);
});
