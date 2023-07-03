const request = require("supertest")
const app = require('../app')
const Product = require('../models/Product')
require("../models/index")

const BASE_URL_USER = '/api/v1/users/login'
const URL_BASE_CART = '/api/v1/cart'
let TOKEN
let userId
let product
let cartId

beforeAll(async() => {
    const user = {
        email: "rey@gmail.com",
        password: "rey150",
    }

    const res = await request(app)
    .post(BASE_URL_USER)
    .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id
})

test("POST -> 'URL_BASE_CART', should return status code 201 & res.body.quantity === body.quantity", async() => {
    const productBody = {
        title: "xiaomi 12",
        description: "lorepDescript",
        price: 50.50
    }
    product = await Product.create(productBody)   //!Todavia no borrar esta instancia
    
    const cartBody = {
        quantity: 1,
        userId,
        productId: product.id
    }

    const res = await request(app)
        .post(URL_BASE_CART)
        .send(cartBody)
        .set("Authorization", `Bearer ${TOKEN}`)
    cartId = res.body.id    //!

    expect(res.status).toBe(201)
    expect(res.body.quantity).toBe(cartBody.quantity)
})

test("GET -> 'URL_BASE_CART', should return status code 200 & res.body length === 1", async() => {
    const res = await request(app)
    .get(URL_BASE_CART)
    .set("Authorization", `Bearer ${TOKEN}`) 

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
})

test("PUT -> 'URL_BASE_CART/:id', should return status code 200 & res.body.quantity === body.quantity", async() => {   
    const cartBody = {
        quantity: 2,
    }

    const res = await request(app)
        .put(`${URL_BASE_CART}/${cartId}`)
        .send(cartBody)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(cartBody.quantity)
})

test("DELETE -> 'URL_BASE_CART/:id', should return status code 204", async() => {   
    const res = await request(app)
        .delete(`${URL_BASE_CART}/${cartId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

    await product.destroy()
})