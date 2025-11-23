// BACKEND/models/tag.js

// Función Generadora de ID (Inicia en 1 para el entregable)
let nextTagId = 1;
function getNextTagID() {
    return nextTagId++;
}

// Clase de Excepción
class TagException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

// Clase del Modelo
class Tag {
    // Atributos Privados
    #id;
    #name;
    #color;
    // Agregado id_user (Requisito de P3 para Tags)
    #id_user; 

    constructor(name, color, id_user = null) {
        // ID autogenerado
        this.#id = getNextTagID(); 
        
        // Asignación a través de setters (ejecuta validaciones)
        this.name = name;
        this.color = color;
        this.id_user = id_user;
    }

    // --- GETTERS ---
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get color() {
        return this.#color;
    }
    get id_user() {
        return this.#id_user;
    }

    // --- SETTERS con Validación ---
    set id(value) {
        throw new TagException("IDs are auto-generated. Cannot be modified."); // Regla: No modificable [cite: 563]
    }
    set name(value) {
        if (!value) {
            throw new TagException("Tag name cannot be empty."); // Regla: No vacío 
        }
        this.#name = value;
    }
    set color(value) {
        // Regla: Formato hexadecimal (Investigación requerida) [cite: 570, 578]
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!value || !hexRegex.test(value)) {
            throw new TagException("Color is not valid. Must be a hexadecimal string (e.g., #ff00ff).");
        }
        this.#color = value;
    }
    set id_user(value) {
        // (La validación de existencia del usuario se hace en el controlador)
        this.#id_user = value;
    }
    
    // Método para exponer datos privados al Backend (Requisito P3)
    toObj() {
        return {
            id: this.#id,
            name: this.#name,
            color: this.#color,
            id_user: this.#id_user
        };
    }
}

// Exporta las clases y funciones necesarias para ser usadas por el controlador
module.exports = { getNextTagID, TagException, Tag };
