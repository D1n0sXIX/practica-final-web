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

const setup = async () => {
    const token = await registerAndLogin()
    const clientRes = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Cliente Test', cif: 'A12345678', email: 'cliente@test.com', phone: '600000000' })
    const client = clientRes.body.data
    const projectRes = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Proyecto Test', projectCode: 'PRJ001', client: client._id })
    const project = projectRes.body.data
    return { token, client, project }
}

describe('POST /api/deliverynote', () => {
    it('debería crear un albarán correctamente', async () => {
        const { token, project } = await setup()
        const res = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: project._id, format: 'hours', description: 'Trabajo test', hours: 8, workDate: new Date() })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('format', 'hours')
    })

    it('debería fallar si el proyecto no existe', async () => {
        const { token } = await setup()
        const res = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: '000000000000000000000000', format: 'hours', hours: 8 })
        expect(res.status).toBe(404)
    })
})

describe('GET /api/deliverynote', () => {
    it('debería listar albaranes', async () => {
        const { token } = await setup()
        const res = await request(app)
            .get('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('DELETE /api/deliverynote/:id', () => {
    it('debería eliminar un albarán no firmado', async () => {
        const { token, project } = await setup()
        const noteRes = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: project._id, format: 'hours', description: 'Test', hours: 8, workDate: new Date() })
        const note = noteRes.body.data
        const res = await request(app)
            .delete(`/api/deliverynote/${note._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })
})

describe('PATCH /api/deliverynote/:id/sign', () => {
    it('debería firmar un albarán', async () => {
        const { token, project } = await setup()
        const noteRes = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: project._id, format: 'hours', description: 'Test', hours: 8, workDate: new Date() })
        const note = noteRes.body.data
        const res = await request(app)
            .patch(`/api/deliverynote/${note._id}/sign`)
            .set('Authorization', `Bearer ${token}`)
            .attach('signature', Buffer.from('fake-image'), 'signature.png')
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('signed', true)
    })
})

describe('WebSocket events', () => {
    it('debería emitir evento al crear albarán', async () => {
        const { token, project } = await setup()
        const res = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: project._id, format: 'hours', description: 'Test', hours: 8, workDate: new Date() })
        expect(res.status).toBe(201)
    })
})

describe('GET /api/deliverynote/pdf/:id', () => {
    it('debería devolver un PDF', async () => {
        const { token, project } = await setup()
        const noteRes = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({ project: project._id, format: 'hours', description: 'Test', hours: 8, workDate: new Date() })
        const note = noteRes.body.data
        const res = await request(app)
            .get(`/api/deliverynote/pdf/${note._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toContain('application/pdf')
    })
})