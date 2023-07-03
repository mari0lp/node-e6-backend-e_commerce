const request = require("supertest")
const app = require("../app");
require("../models/index")                      //! Importante
const Category = require("../models/Category");

const ProductImg = require("../models/ProductImg"); //! para setImages
const BASE_URL_PRODUCT_IMAGES = '/api/v1/product_images'; //! para setImages

const BASE_URL_USERS = '/api/v1/users/login'
const BASE_URL_PRODUCTS = '/api/v1/products'
let TOKEN;
let category;   // Esto NO lo destruire inmediatamente en el 1er POST
let productId;

beforeAll(async () => {
    const user = {
        email: "rey@gmail.com",
        password: "rey150"
    }

    const res = await request(app)
        .post(BASE_URL_USERS)
        .send(user)

    TOKEN = res.body.token
})

//!
test("POST -> 'BASE_URL_PRODUCTS', should return status code 201 & res.body.title === product.title", async () => {
    const categoryBody = {
        name: "Tech"
    }                                               // No lo destruire en el mismo Scope | En el filtro la usare
    category = await Category.create(categoryBody)  //! Todavia no lo removere

    const product = {
        title: "xiaomi 12",
        description: "lorepDescript",
        price: 50.50,
        categoryId: category.id
    }

    const res = await request(app)
        .post(BASE_URL_PRODUCTS)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)

    productId = res.body.id     //! Todavia no lo removere

    expect(res.status).toBe(201)
    expect(res.body.title).toBe(product.title)
})

//!
test("GET -> 'BASE_URL_PRODUCTS', should return status code 200 & res.body.length === 1 & res.body[0] to be defined", async () => {
    const res = await request(app)
        .get(BASE_URL_PRODUCTS)
    //console.log(res.body) //Confirm that bring all products (Opcional: En post, crear 2 prod. con diferentes categorias)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toBeDefined()
})

//! Filtro de "product" con alguna "categoria"
test("GET -> 'BASE_URL_PRODUCTS?category = category.id', should return status code 200 & res.body.length === 1", async () => {
    const res = await request(app)
        .get(`${BASE_URL_PRODUCTS}?category=${category.id}`)
    //console.log(res.body)   //confirmo que el product, si tiene la categoria especificada

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toBeDefined()
})

//!
test("GET ONE -> 'BASE_URL_PRODUCTS/:id', should return status code 200 & res.body.title === xiaomi 12", async () => {
    const res = await request(app)
        .get(`${BASE_URL_PRODUCTS}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe("xiaomi 12")    // Esto es copy/paste de lo que puse en POST
})

//!
test("PUT -> 'BASE_URL_PRODUCTS/:id', should return status code 200 & res.body.length === 1", async () => {
    const product = {
        title: "iphone 12"
    }

    const res = await request(app)
        .put(`${BASE_URL_PRODUCTS}/${productId}`)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(res.body)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe(product.title)
})

// //! POST /products/:id/images (privado)
test("POST -> 'BASE_URL_PRODUCTS/:id/images', should return status code 200 & res.body.message === Success ", async () => {
    // POST -> 'BASE_URL_PRODUCT_IMAGES', should return status code 201 & res.body.url -> to be defined
    const path = require('path');
    const RelativePath = ['..', 'public', 'images_to_upload'];
    const imageTest = 'monitor_2.jpg';
    const imagePath = path.join(__dirname, ...RelativePath, imageTest);

    let res = await request(app)
        .post(BASE_URL_PRODUCT_IMAGES)
        .attach('image', imagePath)
        .set("Authorization", `Bearer ${TOKEN}`)
    productImgId = res.body.id  //Borrare la imagen al final del test()
    //console.log(res.body)

    expect(res.status).toBe(201)
    expect(res.body.url).toBeDefined()

    // POST -> 'BASE_URL_PRODUCTS/:id/images', should return status code 200 & res.body.message === Success
    res = await request(app)
        .post(`${BASE_URL_PRODUCTS}/${productId}/images`)
        .send([productImgId])
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(res.body)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Success")

    // DELETE -> 'BASE_URL_PRODUCT_IMAGES/:id', should return status code 204
    res = await request(app)
        .delete(`${BASE_URL_PRODUCT_IMAGES}/${productImgId}`)
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(res.body)

    expect(res.status).toBe(204)
})

//! DELETE
test("DELETE -> 'BASE_URL_PRODUCTS/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL_PRODUCTS}/${productId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

    await category.destroy()    // "category" removido, para no tener residuos en otros test
})
