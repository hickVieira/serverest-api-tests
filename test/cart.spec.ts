import utils from "./utils";
import { CartPost, CartGet, CartItemPost } from "./Cart";
import { UserWithId } from "./User";
import { ProductWithId } from "./Product";

describe('Cart tests', () => {

    it("should get all carts", async () => {
        const [carts, response] = await utils.get_carts();
        expect(response.status).toBe(200);
    })

    it("should get a cart by id", async () => {
        const cart = await utils.find_random_cart() as CartGet;
        const [cartFound, response] = await utils.get_cart(cart._id);
        expect(response.status).toBe(200);
        expect(cartFound).toEqual(cart);
    })

    it("should post a cart as a user", async () => {
        const user = await utils.find_random_user() as UserWithId;
        const product1 = await utils.find_random_product_not_empty() as ProductWithId;
        const items: CartItemPost[] = [
            new CartItemPost(product1._id, 1)
        ]
        const cart = new CartPost(items);

        // login user
        const [loginSuccess, response1] = await utils.login(user.email, user.password);
        expect(response1.status).toBe(200);

        // post cart
        const [cartCreated, response2] = await utils.post_cart(response1.body.authorization, cart);
        expect(response2.status).toBe(201);
    })

    it("should submit a cart as a user", async () => {
        const user = await utils.find_random_user() as UserWithId;
        const product1 = await utils.find_random_product_not_empty() as ProductWithId;
        const items: CartItemPost[] = [
            new CartItemPost(product1._id, 1)
        ]
        const cart = new CartPost(items);

        // login user
        const [loginSuccess, response1] = await utils.login(user.email, user.password);
        expect(response1.status).toBe(200);

        // post cart
        const [cartCreated, response2] = await utils.post_cart(response1.body.authorization, cart);
        expect(response2.status).toBe(201);

        // submit cart
        const [cartSubmit, response3] = await utils.delete_cart_submit(response1.body.authorization);
        expect(response3.status).toBe(200);
    })

    it("should cancel a cart as a user", async () => {
        const user = await utils.find_random_user() as UserWithId;
        const product1 = await utils.find_random_product_not_empty() as ProductWithId;
        const items: CartItemPost[] = [
            new CartItemPost(product1._id, 1)
        ]
        const cart = new CartPost(items);

        // login user
        const [loginSuccess, response1] = await utils.login(user.email, user.password);
        expect(response1.status).toBe(200);

        // post cart
        const [cartCreated, response2] = await utils.post_cart(response1.body.authorization, cart);
        expect(response2.status).toBe(201);

        // cancel cart
        const [cartCanceled, response3] = await utils.delete_cart_cancel(response1.body.authorization);
        expect(response3.status).toBe(200);
    })
})