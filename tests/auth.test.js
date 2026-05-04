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

describe('GET /api/user', () => {
    it('debería obtener el usuario autenticado', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const userRes = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`)
        expect(userRes.status).toBe(200)
        expect(userRes.body.user).toHaveProperty('email', 'test@test.com')
    })

    it('debería fallar sin token', async () => {
        const res = await request(app).get('/api/user')
        expect(res.status).toBe(401)
    })
})

describe('PUT /api/user/register', () => {
    it('debería actualizar datos personales', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const updateRes = await request(app)
            .put('/api/user/register')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Alex', lastName: 'Test', nif: '12345678A' })
        expect(updateRes.status).toBe(200)
        expect(updateRes.body.user).toHaveProperty('name', 'Alex')
    })
})

describe('PATCH /api/user/company', () => {
    it('debería crear una compañía', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        await request(app)
            .put('/api/user/register')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Alex', lastName: 'Test', nif: '12345678A' })
        const companyRes = await request(app)
            .patch('/api/user/company')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Empresa Test', cif: 'B12345678', isFreelance: false, address: { street: 'Calle Test', number: '1', postal: '28001', city: 'Madrid', province: 'Madrid' } })
        expect(companyRes.status).toBe(200)
        expect(companyRes.body.user).toHaveProperty('company')
    })
})

describe('AppError', () => {
    it('debería crear errores con los factory methods', async () => {
        const res1 = await request(app)
            .get('/api/user')
        expect(res1.status).toBe(401)

        const res2 = await request(app)
            .post('/api/user/login')
            .send({ email: 'noexiste@test.com', password: '12345678' })
        expect(res2.status).toBe(404)

        const res3 = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res3.body.accessToken
        const res4 = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        expect(res4.status).toBe(409)
    })
})
describe('POST /api/user/logout', () => {
    it('debería cerrar sesión correctamente', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const logoutRes = await request(app)
            .post('/api/user/logout')
            .set('Authorization', `Bearer ${token}`)
        expect(logoutRes.status).toBe(200)
    })
})

describe('DELETE /api/user', () => {
    it('debería eliminar usuario con soft delete', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const deleteRes = await request(app)
            .delete('/api/user')
            .query({ soft: 'true' })
            .set('Authorization', `Bearer ${token}`)
        expect(deleteRes.status).toBe(200)
    })

    it('debería eliminar usuario con hard delete', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const deleteRes = await request(app)
            .delete('/api/user')
            .set('Authorization', `Bearer ${token}`)
        expect(deleteRes.status).toBe(200)
    })
})

describe('PUT /api/user/password', () => {
    it('debería cambiar la contraseña correctamente', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'test@test.com', password: '12345678' })
        const token = res.body.accessToken
        const passRes = await request(app)
            .put('/api/user/password')
            .set('Authorization', `Bearer ${token}`)
            .send({ currentPassword: '12345678', newPassword: '87654321' })
        expect(passRes.status).toBe(200)
    })
})

describe('POST /api/user/invite', () => {
    it('debería invitar un usuario', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ email: 'admin@test.com', password: '12345678' })
        const token = res.body.accessToken
        const inviteRes = await request(app)
            .post('/api/user/invite')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'guest@test.com', password: '12345678' })
        expect(inviteRes.status).toBe(201)
    })
})