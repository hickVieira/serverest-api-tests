import utils from "./utils";
import { User, UserWithId } from "./User";
import { CartItemPost, CartPost } from "./Cart";
import { ProductWithId } from "./Product";

describe('User tests', () => {

    it('should get all users', async () => {
        const [users, response] = await utils.get_users();
    })

    it('should get user by id', async () => {
        const randomUser = await utils.find_random_user();
        const user = await utils.get_user(randomUser?._id as string);
        expect(user?._id).toBe(randomUser?._id);
    })

    it('should return error message when user not found', async () => {
        const non_existing_user = await utils.get_user("invalid_id");
    })

    it('should login successfully', async () => {
        const user = await utils.find_random_user() as UserWithId;
        const [success, response] = await utils.login(user.email, user.password);
        expect(success).toBe(true);
    })

    it('should create a new user', async () => {
        const newUser = new User('Fulano Siclano', crypto.randomUUID().toString() + '@email.com.br', 'senha123', "false");
        const [success, response] = await utils.post_user(newUser);
        expect(success).toBe(true);
    })

    it('should fail to create a new user with existing email', async () => {
        // get random user
        const user = await utils.find_random_user() as UserWithId;

        const newUser = new User('Fulano Siclano', user.email, 'senha123', "false");

        const [success, response] = await utils.post_user(newUser);
        expect(success).toBe(false);
    })

    it('should update an existing user', async () => {
        // get random user
        const userBefore = await utils.find_random_user() as UserWithId;

        const [success, response] = await utils.put_user(userBefore._id, new User(userBefore.nome, userBefore.email, userBefore.password, userBefore.administrador));
        expect(success).toBe(true);
        expect(response.status).toBe(200);

        const userAfter = await utils.get_user(userBefore._id);
        expect(userBefore).toStrictEqual(userAfter);
    })

    it('should create a new user if updating a non-existent user', async () => {
        const newUser = new User('Fulano Siclano', crypto.randomUUID().toString() + '@email.com.br', 'senha123', "false");

        const [success, response] = await utils.put_user("invalid_id", new User(newUser.nome, newUser.email, newUser.password, newUser.administrador));
        expect(success).toBe(true);
        expect(response.status).toBe(201);
    })

    it('should delete a user', async () => {
        const user = await utils.find_random_user() as UserWithId;
        const [success, response] = await utils.delete_user(user._id);
        expect(success).toBe(true);
    })

    it('should fail to delete a user with registered carts', async () => {
        // get random user
        const user = await utils.find_random_user_with_no_cart() as UserWithId;

        // login user
        const [loginSuccess, response1] = await utils.login(user.email, user.password);
        expect(response1.status).toBe(200);

        // get random product
        const product = await utils.find_random_product_not_empty() as ProductWithId;

        // create cart
        const cart = new CartPost([new CartItemPost(product._id, 1)])

        // post cart
        const [cartCreated, response2] = await utils.post_cart(response1.body.authorization, cart);
        expect(cartCreated).toBe(true);

        // try to delete user
        const [success, response3] = await utils.delete_user(user._id);
        expect(success).toBe(false);
        expect(response3.status).toBe(400);
    })
})
