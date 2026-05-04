import request from 'supertest'
import app from '../src/app.js'
import { connect, closeDatabase, clearDatabase } from './setup.js'

beforeAll(async () => await connect())
afterAll(async () => await closeDatabase())
afterEach(async () => await clearDatabase())

const registerAndLogin = async () => {
    const res = await request(app)
        .post('/api/user/register')
        .send({ email: 'test@test.com', password: '12345678' })
    const token = res.body.accessToken
    await request(app)
        .put('/api/user/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test', lastName: 'User', nif: '12345678A' })
    await request(app)
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Empresa Test', cif: 'B12345678', isFreelance: false, address: { street: 'Calle Test', number: '1', postal: '28001', city: 'Madrid', province: 'Madrid' } })
    return token
}

const createClient = async (token) => {
    const res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Cliente Test', cif: 'A12345678', email: 'cliente@test.com', phone: '600000000' })
    return res.body.data
}

describe('POST /api/client', () => {
    it('debería crear un cliente correctamente', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Cliente Test', cif: 'A12345678', email: 'cliente@test.com', phone: '600000000' })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('name', 'Cliente Test')
    })

    it('debería fallar si el CIF ya existe', async () => {
        const token = await registerAndLogin()
        await createClient(token)
        const res = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Cliente Test 2', cif: 'A12345678', email: 'cliente2@test.com', phone: '600000001' })
        expect(res.status).toBe(409)
    })

    it('debería fallar sin token', async () => {
        const res = await request(app)
            .post('/api/client')
            .send({ name: 'Cliente Test', cif: 'A12345678' })
        expect(res.status).toBe(401)
    })
})

describe('GET /api/client', () => {
    it('debería listar clientes', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .get('/api/client')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('GET /api/client/:id', () => {
    it('debería obtener un cliente por id', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const res = await request(app)
            .get(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('name', 'Cliente Test')
    })

    it('debería fallar si el cliente no existe', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .get('/api/client/000000000000000000000000')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
    })
})

describe('PUT /api/client/:id', () => {
    it('debería actualizar un cliente', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const res = await request(app)
            .put(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Cliente Actualizado' })
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('name', 'Cliente Actualizado')
    })
})

describe('DELETE /api/client/:id', () => {
    it('debería eliminar un cliente', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const res = await request(app)
            .delete(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })
})

describe('GET /api/client/archived', () => {
    it('debería listar clientes archivados', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        await request(app)
            .delete(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${token}`)
        const res = await request(app)
            .get('/api/client/archived')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBe(1)
    })
})