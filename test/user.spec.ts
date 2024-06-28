import utils from "./utils";
import { User, UserWithId } from "./User";
import { StatusCodes } from "http-status-codes";

describe('User tests', () => {

    it('should return a list of users', async () => {
        let [users, response] = await utils.get_users();
    })

    it('should return a single user', async () => {
        let randomUser = await utils.get_random_user();
        let user = await utils.get_user(randomUser?._id as string);
        expect(user?._id).toBe(randomUser?._id);
    })

    it('should return error message when user not found', async () => {
        let non_existing_user = await utils.get_user("invalid_id");
    })

    it('should create a new user', async () => {
        const existingUser = await utils.get_user_by_email('fulano@email.com.br');
        if (existingUser)
            await utils.delete_user(existingUser._id);

        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        let [success, response] = await utils.post_user(newUser);
        expect(success).toBe(true);
    })

    it('should fail to create a new user with existing email', async () => {
        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");
        const existingUser = await utils.get_user_by_email('fulano@email.com.br');
        if (!existingUser)
            await utils.post_user(newUser);

        let [success, response] = await utils.post_user(newUser);
        expect(success).toBe(false);
    })

    it('should update an existing user', async () => {
        // insert user
        const existingUser = await utils.get_user_by_email('fulano@email.com.br');
        if (!existingUser)
            await utils.post_user(new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false"));

        // delete user with same email if exists
        await utils.delete_user_by_email('fulano-email-novo@email.com.br');

        // update user
        const userBefore = await utils.get_user_by_email('fulano@email.com.br') as UserWithId;
        userBefore.email = 'fulano-email-novo@email.com.br';

        let [success, response] = await utils.put_user(userBefore._id, new User(userBefore.nome, userBefore.email, userBefore.password, userBefore.administrador));
        expect(success).toBe(true);
        expect(response.status).toBe(StatusCodes.OK);

        const userAfter = await utils.get_user(userBefore._id);
        expect(userBefore).toStrictEqual(userAfter);
    })

    it('should create a new user if updating a non-existent user', async () => {
        const existingUser = await utils.get_user_by_email('fulano@email.com.br');
        if (existingUser)
            await utils.delete_user(existingUser._id);

        const newUser = new User('Fulano Siclano', 'fulano@email.com.br', 'senha123', "false");

        let [success, response] = await utils.put_user("invalid_id", new User(newUser.nome, newUser.email, newUser.password, newUser.administrador));
        expect(success).toBe(true);
        expect(response.status).toBe(StatusCodes.CREATED);
    })

    it('should delete a user', async () => {
        const user = await utils.get_random_user() as UserWithId;
        let [success, response] = await utils.delete_user(user._id);
        expect(success).toBe(true);
    })

    it('should fail to delete a user with registered carts', async () => {
        const user = await utils.get_random_user() as UserWithId;
        let [success, response] = await utils.delete_user(user._id);
        // expect(success).toBe(false);

    })
})
