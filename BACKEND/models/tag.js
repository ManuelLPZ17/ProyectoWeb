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

class Tag {
    // Atributos Privados
    #id;
    #name;
    // Eliminamos #color
    #id_user; 

    // Constructor ajustado (ya no recibe 'color')
    constructor(name, id_user = null) {
        this.#id = getNextTagID(); 
        this.name = name;
        this.id_user = id_user;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get name() { return this.#name; }
    // Eliminamos get color()
    get id_user() { return this.#id_user; }

    // --- SETTERS con Validación ---
    set id(value) { /* ... lógica de asignación inicial ... */ }
    set name(value) {
        if (!value) {
            throw new TagException("Tag name cannot be empty."); 
        }
        this.#name = value;
    }
    // Eliminamos set color(value)
    set id_user(value) { /* ... */ this.#id_user = value; }
    
    // Método para exponer datos privados al Backend (Requisito P3)
    toObj() {
        return {
            id: this.#id,
            name: this.#name,
            // Eliminamos color: this.#color
            id_user: this.#id_user
        };
    }
}

// Exporta las clases y funciones necesarias para ser usadas por el controlador
module.exports = { getNextTagID, TagException, Tag };
