const sequelize = require('../utils/connection');
require("../models/index")

const main = async() => {
    try{
        await sequelize.sync({ force: true });
        await sequelize.close() //! Me cierra la conexion con la db
        console.log('Database reset succesful 😀✔️')
    } catch(error){
        console.log(error);
    }
 }

 module.exports = main


/*
Este file puedo basarme inicialmente en test_migrate.js
*/