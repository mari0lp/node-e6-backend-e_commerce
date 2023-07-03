const request = require("supertest")
const app = require("../app")

const BASE_URL = '/api/v1/users';
let TOKEN;
let userId;

beforeAll(async () => {
    const user = {
        email: "rey@gmail.com",
        password: "rey150"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)

    TOKEN = res.body.token
})

test("GET -> 'URL_BASE', should return status code 200 and res.body to have length 1", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)
    //console.log(TOKEN)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
})

test("POST -> 'URL_BASE', should return status code 201 & res.body.firstName === body.firstName", async () => {
    const userCreate = {
        firstName: "Daniela",
        lastName: " Sabrina",
        email: "daniela@gmail.com",
        password: "daniela150",
        phone: "+12345"
    }

    const res = await request(app)
        .post(BASE_URL)
        .send(userCreate)

    userId = res.body.id   //!

    expect(res.status).toBe(201)
    expect(res.body.firstName).toBe(userCreate.firstName)
})

test("PUT -> 'BASE_URL/:id', should return status code 200 & res.body.firstName = body.firtName", async () => {
    const userUpdate = {
        firstName: "Danielaa"
    }

    const res = await request(app)
        .put(`${BASE_URL}/${userId}`)
        .send(userUpdate)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body.firstName).toBe(userUpdate.firstName)
})

//! Login (case: success)
test("POST -> 'URL/login', should return status code 200 & res.body.email === body.email & token definied", async() => {
    const userLogin = {
        email: "daniela@gmail.com",
        password: "daniela150",
    }                               //! del primer POST

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(userLogin)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(userLogin.email)
    expect(res.body.token).toBeDefined()
})

//! Login (case: fail)
test("POST -> 'URL/login', should return status code 401", async() => {
    const userLogin = {
        email: "daniela@gmail.com",
        password: "invalid password",
    }                               //! del primer POST

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(userLogin)

    expect(res.status).toBe(401)    //! Esto sale si falla algo en las credenciales
    expect(res.body.token).toBeUndefined()   //! Esto fue extra mio
})

test("DELETE -> 'BASE_URL/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${userId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
})

