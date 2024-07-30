import supertest from "supertest";
import { randomInt } from "crypto";
import { User, UserWithId } from "./User";
import { Product, ProductWithId } from "./Product";
import { CartPost, CartGet } from "./Cart";

export default class utils {
    static base_url: string = 'https://serverest.dev';

    // Login

    public static async login(email: string, password: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).post('/login').send({ email, password });
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('authorization');
                expect(response.body.message).toBe("Login realizado com sucesso");
                return Promise.resolve([true, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Email e/ou senha inválidos");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    // Users

    public static async get_users(): Promise<[UserWithId[], supertest.Response]> {
        const response = await supertest(this.base_url).get('/usuarios');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('quantidade');
        expect(response.body).toHaveProperty('usuarios');
        expect(response.body.usuarios).toHaveLength(response.body.quantidade);
        return Promise.resolve([response.body.usuarios as UserWithId[], response]);
    }

    public static async get_user(id: string): Promise<UserWithId | undefined> {
        const response = await supertest(this.base_url).get(`/usuarios/${id}`);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('nome');
                expect(response.body).toHaveProperty('email');
                expect(response.body).toHaveProperty('password');
                expect(response.body).toHaveProperty('administrador');
                expect(response.body).toHaveProperty('_id');
                return Promise.resolve(response.body as UserWithId);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Usuário não encontrado");
                // console.log(response.body);
                return undefined
            default:
                // console.log(response.body);
                return undefined
        }
    }

    public static async find_random_user(): Promise<UserWithId | undefined> {
        const [users, response] = await utils.get_users();
        return Promise.resolve(users[randomInt(0, users.length - 1)]);
    }

    public static async find_random_user_admin(): Promise<UserWithId | undefined> {
        const [users, response] = await utils.get_users();
        return Promise.resolve(users.find(user => user.administrador === "true"));
    }

    public static async find_random_user_with_no_cart(): Promise<UserWithId | undefined> {
        const [users, response1] = await utils.get_users();
        const [carts, response2] = await utils.get_carts();
        return Promise.resolve(users.find(user => !carts.some(cart => cart.idUsuario === user._id)));
    }

    public static async find_user_by_email(email: string): Promise<UserWithId | undefined> {
        const [users, response] = await utils.get_users();
        return Promise.resolve(users.find(user => user.email === email));
    }

    public static async post_user(user: User): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).post('/usuarios').send(user);
        switch (response.status) {
            case 201:
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Este email já está sendo usado");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async put_user(id: string, user: User): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).put(`/usuarios/${id}`).send(user);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro alterado com sucesso");
                return Promise.resolve([true, response]);
            case 201:
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Este email já está sendo usado");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_user(id: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url).delete(`/usuarios/${id}`);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro excluído com sucesso" || "Nenhum registro excluído");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('idCarrinho');
                expect(response.body.message).toBe("Não é permitido excluir usuário com carrinho cadastrado");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_user_by_email(email: string): Promise<[boolean, supertest.Response]> {
        const user = await utils.find_user_by_email(email) as UserWithId;
        if (user)
            return await utils.delete_user(user._id);
        else
            return Promise.resolve([true, {} as supertest.Response]);
    }

    // Products

    public static async get_products(): Promise<[ProductWithId[], supertest.Response]> {
        const response = await supertest(this.base_url).get('/produtos');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('quantidade');
        expect(response.body).toHaveProperty('produtos');
        expect(response.body.produtos).toHaveLength(response.body.quantidade);
        return Promise.resolve([response.body.produtos as ProductWithId[], response]);
    }

    public static async get_product(id: string): Promise<ProductWithId | undefined> {
        const response = await supertest(this.base_url).get(`/produtos/${id}`);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('nome');
                expect(response.body).toHaveProperty('preco');
                expect(response.body).toHaveProperty('descricao');
                expect(response.body).toHaveProperty('quantidade');
                expect(response.body).toHaveProperty('_id');
                return Promise.resolve(response.body as ProductWithId);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Produto não encontrado");
                // console.log(response.body);
                return undefined
            default:
                // console.log(response.body);
                return undefined
        }
    }

    public static async find_random_product(): Promise<ProductWithId | undefined> {
        const [products, response] = await utils.get_products();
        return Promise.resolve(products[randomInt(0, products.length - 1)]);
    }

    public static async find_random_product_not_empty(): Promise<ProductWithId | undefined> {
        const [products, response] = await utils.get_products();
        return Promise.resolve(products.find(product => product.quantidade > 0));
    }

    public static async find_product_by_name(name: string): Promise<ProductWithId | undefined> {
        const [products, response] = await utils.get_products();
        return Promise.resolve(products.find(product => product.nome === name));
    }

    public static async post_product(token: string, product: Product): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .post('/produtos')
            .send(product)
            .set('Authorization', token);
        switch (response.status) {
            case 201:
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Já existe produto com esse nome");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 403:
                expect(response.status).toBe(403);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Rota exclusiva para administradores");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async put_product(token: string, id: string, product: Product): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .put(`/produtos/${id}`)
            .send(product)
            .set('Authorization', token);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro alterado com sucesso");
                return Promise.resolve([true, response]);
            case 201:
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Este nome de produtor está sendo usado");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 403:
                expect(response.status).toBe(403);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Rota exclusiva para administradores");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_product(token: string, id: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .delete(`/produtos/${id}`)
            .set('Authorization', token);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro excluído com sucesso" || "Nenhum registro excluído");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('idCarrinho');
                expect(response.body.message).toBe("Não é permitido excluir produto que faz parte de carrinho");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 403:
                expect(response.status).toBe(403);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Rota exclusiva para administradores");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    // Carts

    public static async get_carts(): Promise<[CartGet[], supertest.Response]> {
        const response = await supertest(this.base_url)
            .get('/carrinhos')
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('quantidade');
                expect(response.body).toHaveProperty('carrinhos');
                expect(response.body.carrinhos).toBeInstanceOf(Array);
                return Promise.resolve([response.body.carrinhos as CartGet[], response]);
            default:
                return Promise.resolve([[], response]);
        }
    }

    public static async get_cart(id: string): Promise<[CartGet | undefined, supertest.Response]> {
        const response = await supertest(this.base_url)
            .get(`/carrinhos/${id}`)
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('produtos');
                expect(response.body).toHaveProperty('precoTotal');
                expect(response.body).toHaveProperty('quantidadeTotal');
                expect(response.body).toHaveProperty('idUsuario');
                expect(response.body).toHaveProperty('_id');
                return Promise.resolve([response.body as CartGet, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Carrinho não encontrado");
                return Promise.resolve([undefined, response]);
            default:
                return Promise.resolve([undefined, response]);
        }
    }

    public static async find_random_cart(): Promise<CartGet | undefined> {
        const [carts, response] = await utils.get_carts();
        return Promise.resolve(carts[randomInt(0, carts.length - 1)]);
    }

    public static async post_cart(token: string, cart: CartPost): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .post('/carrinhos')
            .send(cart)
            .set('Authorization', token);
        switch (response.status) {
            case 201:
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('_id');
                expect(response.body.message).toBe("Cadastro realizado com sucesso");
                return Promise.resolve([true, response]);
            case 400:
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Não é permitido possuir produto duplicado" || "Não é permitido ter mais de 1 carrinho" || "Produto não encontrado" || "Produto não possui quantidade suficiente");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_cart_submit(token: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .delete(`/carrinhos/concluir-compra`)
            .set('Authorization', token);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro excluído com sucesso" || "Não foi encontrado carrinho para esse usuário");
                return Promise.resolve([true, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }

    public static async delete_cart_cancel(token: string): Promise<[boolean, supertest.Response]> {
        const response = await supertest(this.base_url)
            .delete(`/carrinhos/concluir-compra`)
            .set('Authorization', token);
        switch (response.status) {
            case 200:
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Registro excluído com sucesso" || "Não foi encontrado carrinho para esse usuário");
                return Promise.resolve([true, response]);
            case 401:
                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
                // console.log(response.body);
                return Promise.resolve([false, response]);
            default:
                // console.log(response.body);
                return Promise.resolve([false, response]);
        }
    }
}