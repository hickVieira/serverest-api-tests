import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { User, UserWithId } from "./User";
import { randomInt } from "crypto";

export default class utils {
    static base_url: string = 'https://serverest.dev';
    static user_ids: string[] = ['0uxuPY0cbmQhpEz1', '06WAAen0ZzD99vxH', '0LHxtkGLXewVcKtT'];

    public static async get_users(): Promise<[UserWithId[], supertest.Response]> {
        const response = await supertest(this.base_url).get('/usuarios');
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('quantidade');
        expect(response.body).toHaveProperty('usuarios');
        expect(response.body.usuarios).toHaveLength(response.body.quantidade);
        return Promise.resolve([response.body.usuarios as UserWithId[], response]);
    }

    public static async get_user(id: string): Promise<UserWithId | undefined> {
        const response = await supertest(this.base_url).get(`/usuarios/${id}`);
        switch (response.status) {
            case StatusCodes.OK:
                expect(response.status).toBe(StatusCodes.OK);
                expect(response.body).toHaveProperty('nome');
                expect(response.body).toHaveProperty('email');
                expect(response.body).toHaveProperty('password');
                expect(response.body).toHaveProperty('administrador');
                expect(response.body).toHaveProperty('_id');
                return Promise.resolve(response.body as UserWithId);
            default:
                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Usuário não encontrado");
                return undefined
        }
    }

    public static async get_random_user(): Promise<UserWithId | undefined> {
        const [users, response] = await utils.get_users();
        return Promise.resolve(users[randomInt(0, users.length - 1)]);
    }

    public static async get_user_by_email(email: string): Promise<UserWithId | undefined> {
        const [users, response] = await utils.get_users();
        return Promise.resolve(users.find(user => user.email === email));
    }

    public static async post_user(user: User): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).post('/usuarios').send(user);
        switch (response.status) {
            case StatusCodes.CREATED:
                expect(response.status).toBe(StatusCodes.CREATED);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            default:
                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Este email já está sendo usado");
                return Promise.resolve([false, response]);
        }
    }

    public static async put_user(id: string, user: User): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).put(`/usuarios/${id}`).send(user);
        switch (response.status) {
            case StatusCodes.OK:
                expect(response.status).toBe(StatusCodes.OK);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro alterado com sucesso");
                return Promise.resolve([true, response]);
            case StatusCodes.CREATED:
                expect(response.status).toBe(StatusCodes.CREATED);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            default:
                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Este email já está sendo usado");
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_user(id: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).delete(`/usuarios/${id}`);
        switch (response.status) {
            case StatusCodes.OK:
                expect(response.status).toBe(StatusCodes.OK);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro excluído com sucesso" || "Nenhum registro excluído");
                return Promise.resolve([true, response]);
            default:
                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('idCarrinho');
                expect(response.body.message).toBe("Não é permitido excluir usuário com carrinho cadastrado");
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_user_by_email(email: string): Promise<[boolean, supertest.Response]> {
        const user = await utils.get_user_by_email(email) as UserWithId;
        if (user)
            return await utils.delete_user(user._id);
        else
            return Promise.resolve([true, {} as supertest.Response]);
    }
}