import supertest from "supertest";
import { StatusCodes } from "http-status-codes";

const request = supertest('https://serverest.dev');

class utils {
    static user_ides = ['023j2sNg0jW0liqv', '06WAAen0ZzD99vxH', '0LHxtkGLXewVcKtT'];
}

class User {
    public nome: string;
    public email: string;
    public password: string;
    public administrador: string;

    constructor(nome: string, email: string, password: string, administrador: string) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.administrador = administrador;
    }
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
        const response = await request.get(`/usuarios/${utils.user_ides[0]}`);
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
        expect(response.body.message).toBe("Usuário não encontrado");
    })

    let newUserID: string;
    it('should create a new user', async () => {
        const user = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        const response = await request.post('/usuarios').send(user);
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('_id');
        expect(response.body.message).toBe("Cadastro realizado com sucesso");
        newUserID = response.body._id;
    })

    it('should fail to create a new user with existing email', async () => {
        const user = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        const response = await request.post('/usuarios').send(user);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("Este email já está sendo usado");
    })

    it('should update a existing user', async () => {
        const user = new User('Fulano Ciclano', 'fulano@email.com.br', 'senha123', "false");
        const response = await request.put('/usuarios/').send(user);
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("Registro alterado com sucesso");
    })

    it('should create a new user if updating a non-existent user', async () => {
        const user = new User('Fulano Nao-Existente', 'fulano-novo@email.com.br', 'senha123', "false");
        const response = await request.put('/usuarios/').send(user);
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('_id');
        expect(response.body.message).toBe("Cadastro efetuado com sucesso");
    })

    it('should fail to update a user with same email', async () => {
        const user = new User('Ciclano Fulano', 'fulano-novo@email.com.br', 'senha123', "false");
        const response = await request.put('/usuarios/').send(user);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("Este email já está sendo usado");
    })

    it('should delete a user', async () => {
        const response = await request.delete(`/usuarios/${newUserID}`);
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("Registro excluído com sucesso" || "Nenhum registro excluído");
    })

    it('should fail to delete a user with registered carts', async () => {
        const response = await request.delete(`/usuarios/${newUserID}`);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('idCarrinho');
        expect(response.body.message).toBe("Não é permitido excluir usuário com carrinho cadastrado");
    })
})
