// BACKEND/server.js

const express = require('express');
const { dbConnect } = require('./database/db.connector'); // Conexión a MongoDB
const router = require('./routes/api'); // Router principal (users, html files, etc.)
const cors = require('cors');

const mongoose = require('mongoose');


const app = express();
const port = 3000;

// Middleware Global
app.use(express.json()); // Permite que la API interprete los JSON del body [cite: 106]
app.use(cors());         // Permite peticiones desde el frontend (puertos diferentes)
app.use(router);         // Usa el router principal para manejar todas las rutas [cite: 107]
app.use('/api', router);

// Conecta a la base de datos y luego inicia el servidor
dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`corriendo en el puerto ${port}!`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de DB:", err);
});


// Definimos el esquema:
let userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        min: 0,
        max: 120,
        required: true
    },
    sexo: {
        type: String,
        enum: ['H', 'M'],
        required: true
    }
});
// Creamos el modelo (nombre, esquema)
let User = mongoose.model('users', userSchema);

app.post('/api/users', (req, res) => {
    console.log("Guardando usuario...");
    // Información que va a tener nuestro nuevo registro
    let newUser = {
    
        
        nombre: req.body.nombre,
        correo: req.body.correo,
        pass: req.body.pass,
        edad: req.body.edad,
        sexo: req.body.sexo
    };
    // A partir de la información y el modelo, hacemos un usuario
    let user = User(newUser);
    // Guardamos el usuario en la BD (OJO, es asíncrono)
    user.save().then((doc) => {
        console.log("Usuario creado: " + doc);
        res.send('Usuario creado exitosamente: ' + doc);
    });
});

app.get('/api/users', (req, res) => {
    console.log("Consultando usuarios...");
    let nombre = req.query.nombre;

    User.find({
        nombre: {$regex: nombre}
    }).then(function (docs) {
        res.send(docs);
        console.log(docs);
    }).catch((err) => console.log(err));
});

app.put('/api/users', (req, res) => {
    console.log("Actualizando información...");
    let id = req.body.id,
        nombre = req.body.nombre,
        object_to_uptade = {},
        flag_uptaded = false;
    if(nombre != undefined){
        object_to_uptade.nombre = nombre;
        flag_uptaded = true;
    }    
    console.log(id);
    if(flag_uptaded){
        User.findByIdAndUpdate(id,object_to_uptade,{new : true}).then((doc) =>{
            console.log("usuario actualizado:");
            console.log(doc);
            res.send(doc);
        }).catch((err) => console.log(err));
    }else{
        res.send("no se ha actualizado");
    }

});

//AGREGA AQUÍ EL DELETE

app.delete('/api/users', (req, res) => {
    console.log("Eliminando información...");
    let id = req.body.id;
    User.findByIdAndDelete(id).then((doc) =>{
        console.log("usuario eliminado");
        console.log(doc);
        res.send(doc);
    }).catch((err) => console.log(err));
});


