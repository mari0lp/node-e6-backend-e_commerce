const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;  //! contiene el bearer token
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);     //! 
    const token = authHeader.split(' ')[1];  //! Separamos el token
    jwt.verify(
        token,
        process.env.TOKEN_SECRET,   //! Lo siguiente es una comprobacion
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.user;    //! el user desencriptado, si fue exitoso el logeado /Se guarda en req.user
            next();     //! Esto es un middleware / Es para que no se caiga (algo relacionado con routes/index.js) / Paso el controlador
        }
    )
}

module.exports = verifyJWT;


//! Cuando desencripto el token, lo que obtengo es el usuario logeado