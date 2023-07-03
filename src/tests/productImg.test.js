const request = require("supertest")
const app = require("../app");
require("../models/index")
const ProductImg = require("../models/ProductImg");

const BASE_URL_PRODUCT_IMAGES = '/api/v1/product_images'
let TOKEN;
let productImgId;

beforeAll(async () => {
    const user = {
        email: "rey@gmail.com",
        password: "rey150"
    }

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
})

test("POST -> 'BASE_URL_PRODUCT_IMAGES', should return status code 201 & res.body.url === productImg.url", async () => {
    const path = require('path');
    const RelativePath = ['..', 'public', 'images_to_upload'];
    const imageTest = 'monitor_1.jpg';  //! Tengo mas imagenes en /images_to_upload
    const imagePath = path.join(__dirname, ...RelativePath, imageTest);

    const res = await request(app)
        .post(BASE_URL_PRODUCT_IMAGES)
        .attach('image', imagePath)
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(imagePath)
    //console.log(res.body)

    productImgId = res.body.id  //Borrare la imagen en el ultimo test()    //!

    expect(res.status).toBe(201)
    expect(res.body.url).toBeDefined()
})

test("GET -> 'BASE_URL_PRODUCT_IMAGES', should return status code 200 & res.body length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL_PRODUCT_IMAGES)
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(res.body)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].url).toBeDefined()
})

test("DELETE -> 'BASE_URL_PRODUCT_IMAGES/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL_PRODUCT_IMAGES}/${productImgId}`)
        .set("Authorization", `Bearer ${TOKEN}`)
    //console.log(res.body)  // {}

    expect(res.status).toBe(204)
})