const { getAll, create, getOne, remove, update } = require('../controllers/productImg.controllers');
const express = require('express');
const verifyJWT = require("../utils/verifyJWT")

const upload = require("../utils/multer")   //!

const routerProductImg = express.Router();

routerProductImg.route('/')
    .get(verifyJWT, getAll)
    .post(upload.single('image'), verifyJWT, create);

routerProductImg.route('/:id')
    .delete(verifyJWT, remove)


module.exports = routerProductImg;