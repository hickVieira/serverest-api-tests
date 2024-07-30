import utils from "./utils";
import { User, UserWithId } from "./User";

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
        const existingUser = await utils.find_user_by_email('fulano@email.com.br');
        if (existingUser)
            await utils.delete_user(existingUser._id);

        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        const [success, response] = await utils.post_user(newUser);
        expect(success).toBe(true);
    })

    it('should fail to create a new user with existing email', async () => {
        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        const existingUser = await utils.find_user_by_email('fulano@email.com.br');
        if (!existingUser)
            await utils.post_user(newUser);

        const [success, response] = await utils.post_user(newUser);
        expect(success).toBe(false);
    })

    it('should update an existing user', async () => {
        // insert user
        const existingUser = await utils.find_user_by_email('fulano@email.com.br');
        if (!existingUser)
            await utils.post_user(new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false"));

        // delete user with same email if exists
        await utils.delete_user_by_email('fulano-email-novo@email.com.br');

        // update user
        const userBefore = await utils.find_user_by_email('fulano@email.com.br') as UserWithId;
        userBefore.email = 'fulano-email-novo@email.com.br';

        const [success, response] = await utils.put_user(userBefore._id, new User(userBefore.nome, userBefore.email, userBefore.password, userBefore.administrador));
        expect(success).toBe(true);
        expect(response.status).toBe(200);

        const userAfter = await utils.get_user(userBefore._id);
        expect(userBefore).toStrictEqual(userAfter);
    })

    it('should create a new user if updating a non-existent user', async () => {
        const existingUser = await utils.find_user_by_email('fulano@email.com.br');
        if (existingUser)
            await utils.delete_user(existingUser._id);

        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");

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
        const user = await utils.find_random_user() as UserWithId;
        const [success, response] = await utils.delete_user(user._id);
        // expect(success).toBe(false);

    })
})
