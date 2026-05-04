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

describe('POST /api/client', () => {
    it('debería crear un cliente correctamente', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'B12345678',
                email: 'cliente@test.com',
                phone: '600000000'
            })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('name', 'Cliente Test')
    })
})

describe('GET /api/client', () => {
    it('debería obtener la lista de clientes', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .get('/api/client')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
    })
})