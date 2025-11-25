// BACKEND/models/review.js

// --- 1. FUNCIÓN GENERADORA DE ID ---
let nextReviewId = 1;

function getNextReviewID() {
    return nextReviewId++;
}

// --- 2. CLASE DE EXCEPCIÓN ---
class ReviewException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

// --- 3. CLASE DEL MODELO (RESEÑA) ---
class Review {
    // Atributos Privados
    #id;
    #title;
    #description;
    #due_date;
    #owner; // ID del Usuario que crea la reseña
    #status;
    #tags;
    #rating; // Calificación 1-10
    #movie_id; // ID de la película (TMDb)

    /**
     * constructor(title, description, due_date, owner, movie_id, tags = [], rating = 1)
     *
     * Nota: Se agregó movie_id como parámetro obligatorio entre owner y tags.
     */
    constructor(title, description, due_date, owner, movie_id, tags = [], rating = 1) {
        this.#id = getNextReviewID();

        // Asignación usando setters para validar
        this.title = title;
        this.description = description; // Atributo libre
        this.due_date = due_date;
        this.owner = owner;
        this.movie_id = movie_id; // <-- nuevo campo
        this.status = 'A'; // Por defecto Active
        this.tags = tags;
        this.rating = rating;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get due_date() { return this.#due_date; }
    get owner() { return this.#owner; }
    get status() { return this.#status; }
    get tags() { return this.#tags; }
    get rating() { return this.#rating; }
    get movie_id() { return this.#movie_id; }

    // --- SETTERS con Validación ---
    set id(value) {
        // Solo lanza excepción si el ID ya existe. 
        // Esto permite que el servicio asigne el ID numérico (consecutivo)
        if (this.#id) { 
            throw new ReviewException("IDs are auto-generated and cannot be modified after creation.");
        }
        this.#id = value;
    }

    set title(value) {
        if (!value) {
            throw new ReviewException("Review title cannot be empty."); // Regla: No vacío
        }
        this.#title = value;
    }

    set description(value) {
        // Atributo libre (sin validación de no vacío, solo asignación)
        this.#description = value;
    }

    set due_date(value) {
        const date = new Date(value);
        if (isNaN(date)) {
            throw new ReviewException("Invalid date format. Must be accepted by new Date()."); // Regla: Formato de fecha válido
        }
        this.#due_date = date.toISOString();
    }

    set owner(value) {
        // Regla: Debe ser un ID de usuario existente (validación inter-modelo en el controlador)
        this.#owner = value;
    }

    set status(value) {
        const validStatuses = ['A', 'F', 'C'];
        if (!validStatuses.includes(value)) {
            throw new ReviewException("Status must be A (Active), F (Finished), or C (Cancelled)."); // Regla: A, F, o C
        }
        this.#status = value;
    }

    set tags(value) {
        if (!Array.isArray(value)) {
            throw new ReviewException("Tags must be an array of Tag IDs.");
        }
        // Regla: Los Tags deben existir (validación inter-modelo en el controlador)
        this.#tags = value;
    }

    set rating(value) {
        // Asegura que el valor sea numérico, no indefinido, y esté dentro del rango 1-10
        if (value === undefined || typeof value !== 'number' || value < 1 || value > 10) {
            throw new ReviewException("Rating must be a number between 1 and 10."); // Regla: Rating (1-10)
        }
        this.#rating = value;
    }

    set movie_id(value) {
        // movie_id debe ser el ID numérico de la película (TMDb)
        if (value === undefined || value === null) {
            throw new ReviewException("movie_id is required and must be a numeric TMDb movie ID.");
        }
        // Acepta números o strings numéricos convertibles a número
        const num = typeof value === 'number' ? value : Number(value);
        if (Number.isNaN(num) || !Number.isFinite(num) || !Number.isInteger(num) || num <= 0) {
            throw new ReviewException("movie_id must be a positive integer representing the TMDb movie ID.");
        }
        this.#movie_id = num;
    }

    // --- CONVERSIÓN DE OBJETO (Para guardar en DB/JSON) ---
    toObj() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            due_date: this.#due_date,
            owner: this.#owner,
            movie_id: this.#movie_id,
            status: this.#status,
            tags: this.#tags,
            rating: this.#rating,
        };
    }
}

// Exporta las clases y funciones para ser usadas por el controlador
module.exports = { getNextReviewID, ReviewException, Review };
