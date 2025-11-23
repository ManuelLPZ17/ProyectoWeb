// BACKEND/models/user.js

// Función Generadora de ID (La lógica real se actualizará en el controlador P3)
let nextUserId = 1;
function getNextUserID() {
    return nextUserId++;
}

// Clase de Excepción
class UserException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

// Clase del Modelo
class User {
    // Atributos Privados
    #id;
    #name; // Regla: NO debe poderse modificar una vez generado (validaremos en setter)
    #email;
    #password;
    #joined_at; // Regla: Autogenerado con la fecha actual

    constructor(name, email, password) {
        this.#id = getNextUserID();
        this.#joined_at = new Date().toISOString(); // Autogenerado [cite: 575]

        this.name = name; // Usamos el setter
        this.email = email;
        this.password = password;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get name() { return this.#name; }
    get email() { return this.#email; }
    get password() { return this.#password; }
    get joined_at() { return this.#joined_at; }

    // --- SETTERS con Validación ---
    set id(value) {
        throw new UserException("IDs are auto-generated. Cannot be modified."); // Regla: No modificable 
    }
    set joined_at(value) {
        // Para las actualizaciones, si se intenta modificar, lanzamos excepción (excepto en el constructor)
        if (this.#joined_at) {
             throw new UserException("Joined date cannot be modified."); // Regla: No modificable 
        }
        this.#joined_at = value;
    }
    set name(value) {
        if (!value) {
            throw new UserException("User name cannot be empty."); // Regla: No vacío 
        }
        // Regla: No puede modificarse una vez generado (Lo manejamos en el controlador, o aquí si no quieres que se actualice nunca)
        // Para permitir la edición, omitimos la excepción aquí y la gestionamos en el controlador de la API (PATCH)
        this.#name = value;
    }
    set email(value) {
        if (!value) {
            throw new UserException("Email cannot be empty."); // Regla: No vacío 
        }
        // Regla: Email no repetido (La validación inter-usuario se hace en el controlador)
        this.#email = value;
    }
    set password(value) {
        if (!value || value.length < 8) {
            throw new UserException("Password cannot be empty and must have at least 8 characters."); // Regla: Mínimo 8 caracteres 
        }
        this.#password = value;
    }

    // Método para exponer datos privados al Backend (Requisito P3)
    toObj() {
        return {
            id: this.#id,
            name: this.#name,
            email: this.#email,
            password: this.#password,
            joined_at: this.#joined_at
        };
    }
}

module.exports = { getNextUserID, UserException, User };