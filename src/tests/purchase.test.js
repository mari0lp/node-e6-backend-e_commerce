const request = require("supertest")
const app = require('../app')
const Product = require("../models/Product")
const Cart = require("../models/Cart")

require("../models/index")


const BASE_URL_USERS = "/api/v1/users/login"
const BASE_URL_PURCHASE = "/api/v1/purchase"
let TOKEN
let userId
let product

beforeAll(async () => {
    const user = {
        email: "rey@gmail.com",
        password: "rey150",
    }

    const res = await request(app)
        .post(BASE_URL_USERS)
        .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id   //checando en postman (login), queda claro //!

})

test("POST -> 'BASE_URL_PURCHASE', should return status code 201 & res.body.quantity === body.quantity", async () => {
    const productBody = {
        title: "iphone 12",
        description: "lorep12",
        price: 123.78
        // categoryId: category.id      //No me interesaba para este test, pero el Product si lo ocupo
    }
    product = await Product.create(productBody)   //! Lo eliminaremos en otro test()

    const cartBody = {
        quantity: 23,
        userId,                 // sale de beforeAll
        productId: product.id
    }
    await Cart.create(cartBody)         //! El purchase.controllers.js lo destruye despues del POST

    const res = await request(app)
        .post(BASE_URL_PURCHASE)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(201)
    expect(res.body[0].quantity).toBe(cartBody.quantity)

    //del cart no le declaramos, porque el mismo controllers lo destruye
    // y del product lo destruiremos despues de otros test()
})

test("GET -> 'BASE_URL_PURCHASE', should return status code 200 & res.body length === 1", async() => {
    const res = await request(app)
        .get(BASE_URL_PURCHASE)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)

    await product.destroy()
})