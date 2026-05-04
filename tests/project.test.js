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

const createProject = async (token, clientId) => {
    const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Proyecto Test', projectCode: 'PRJ001', client: clientId })
    return res.body.data
}

describe('POST /api/project', () => {
    it('debería crear un proyecto correctamente', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const res = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Proyecto Test', projectCode: 'PRJ001', client: client._id })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('name', 'Proyecto Test')
    })

    it('debería fallar si el cliente no existe', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Proyecto Test', projectCode: 'PRJ001', client: '000000000000000000000000' })
        expect(res.status).toBe(404)
    })
})

describe('GET /api/project', () => {
    it('debería listar proyectos', async () => {
        const token = await registerAndLogin()
        const res = await request(app)
            .get('/api/project')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('GET /api/project/:id', () => {
    it('debería obtener un proyecto por id', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const project = await createProject(token, client._id)
        const res = await request(app)
            .get(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('name', 'Proyecto Test')
    })
})

describe('DELETE /api/project/:id', () => {
    it('debería eliminar un proyecto', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const project = await createProject(token, client._id)
        const res = await request(app)
            .delete(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })
})

describe('PUT /api/project/:id', () => {
    it('debería actualizar un proyecto', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const project = await createProject(token, client._id)
        const res = await request(app)
            .put(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Proyecto Actualizado' })
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('name', 'Proyecto Actualizado')
    })
})

describe('GET /api/project/archived', () => {
    it('debería listar proyectos archivados', async () => {
        const token = await registerAndLogin()
        const client = await createClient(token)
        const project = await createProject(token, client._id)
        await request(app)
            .delete(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        const res = await request(app)
            .get('/api/project/archived')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBe(1)
    })
})
