const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');
const path = require('path');   //! para Multer
require('dotenv').config();

// Esta es nuestra aplicación
const app = express();

// Middlewares 
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public'))); // /style.css //! para Multer 

app.use('/api/v1', router);
app.get('/', (req, res) => {
    return res.send("Welcome to express!");
})

// middlewares después de las rutas
app.use(errorHandler)

module.exports = app;
