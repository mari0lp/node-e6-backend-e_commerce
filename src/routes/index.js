const express = require('express');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const routerCart = require('./cart.router');
const routerPurchase = require('./purchase.router');
const routerProductImg = require('./productImg.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', routerUser)
router.use('/categories', routerCategory)
router.use('/products', routerProduct)
router.use('/cart', routerCart)     //del nombre... solo puede haber 1 carro
router.use('/purchase', routerPurchase) //del nombre... solo puede haber 1 compra
router.use('/product_images', routerProductImg)

module.exports = router;