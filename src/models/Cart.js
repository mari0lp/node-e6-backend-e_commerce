const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Category = sequelize.define('cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    //userId
    //productId
});

module.exports = Category;