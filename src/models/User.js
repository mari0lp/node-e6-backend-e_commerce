const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const bcrypt = require("bcrypt")

const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//! Como encriptar una password desde antes de que se cree: (dice que es mas limpio)

//! No dejamos que se muestre password
User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;   //! Esto es para que en los controladores no este muy cargado de lineas¿???
    // delete values.phone;
    return values;
}

//! Porque se encripta desde este file ¿???   9:50 - 9:51
//! Encriptar la contraseña desde antes que se cree la password
User.beforeCreate(async (user) => {
    hashPassword = await bcrypt.hash(user.password, 10)
    user.password = hashPassword
})

module.exports = User;