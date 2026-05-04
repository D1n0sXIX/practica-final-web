process.env.JWT_SECRET = 'test_secret_key_para_jest'
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_para_jest'

import request from 'supertest'
import app from '../src/app.js'
import { connect, closeDatabase, clearDatabase } from './setup.js'

beforeAll(async () => await connect())
afterAll(async () => await closeDatabase())
afterEach(async () => await clearDatabase())

describe('POST /api/user/register', () => {
    it('debería registrar un usuario correctamente', async () => {
    const res = await request(app)
        .post('/api/user/register')
        .send({ email: 'test@test.com', password: '12345678' })
    
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('accessToken')
})
})

describe('POST /api/user/login', () => {
        it('debería iniciar sesión correctamente', async () => {
        await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'test@test.com', password: '12345678' })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('accessToken')
    })
    it('debería fallar con credenciales incorrectas', async () => {
    const res = await request(app)
        .post('/api/user/login')
        .send({ email: 'noexiste@test.com', password: '12345678' })

    expect(res.status).toBe(404)
})
})

