import supertest from "supertest";
import { StatusCodes } from "http-status-codes";

const request = supertest('https://serverest.dev');

class User {
    static ids = ['023j2sNg0jW0liqv', '06WAAen0ZzD99vxH', '0LHxtkGLXewVcKtT'];
}

describe('User tests', () => {

    it('should return a list of users', async () => {
        const response = await request.get('/usuarios');
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('quantidade');
        expect(response.body).toHaveProperty('usuarios');
        expect(response.body.usuarios).toHaveLength(response.body.quantidade);
    })

    it('should return a single user', async () => {
        const response = await request.get(`/usuarios/${User.ids[0]}`);
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('nome');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
        expect(response.body).toHaveProperty('administrador');
        expect(response.body).toHaveProperty('_id');
    })

    it('should return error message when user not found', async () => {
        const response = await request.get(`/usuarios/invalid-id`);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message.normalize()).toBe('Usuário não encontrado'.normalize());
    })
})