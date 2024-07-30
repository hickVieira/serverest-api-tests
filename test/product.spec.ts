import utils from "./utils";
import { Product, ProductWithId } from "./Product";
import { UserWithId } from "./User";

describe('Product tests', () => {

    let randAdmin: UserWithId;
    let adminToken: string;
    let randUser: UserWithId;
    let userToken: string;
    let randProductName = crypto.randomUUID().toString() + crypto.randomUUID().toString();

    beforeAll(async () => {
        {
            randAdmin = await utils.find_random_user_admin() as UserWithId;
            const [success, response] = await utils.login(randAdmin.email, randAdmin.password);
            adminToken = response.body.authorization;
            expect(success).toBe(true);
        }

        {
            randUser = await utils.find_random_user() as UserWithId;
            const [success, response] = await utils.login(randUser.email, randUser.password);
            userToken = response.body.authorization;
            expect(success).toBe(true);
        }
    })

    it('should get all products', async () => {
        const [products, response] = await utils.get_products();
    })

    it('should get product by id', async () => {
        const randomProduct = await utils.find_random_product();
        const product = await utils.get_product(randomProduct?._id as string);
        expect(product?._id).toBe(randomProduct?._id)
    })

    it('should return error message when product not found', async () => {
        const non_existing_product = await utils.get_product("invalid_id");
        expect(non_existing_product).toBeUndefined();
    })

    it('should create a new product as a admin', async () => {
        const [success, response] = await utils.post_product(adminToken, {
            nome: randProductName,
            preco: 100,
            descricao: 'Random product desc',
            quantidade: 100
        });
        expect(success).toBe(true);
        expect(response.status).toBe(201);
    })

    it('should fail to create a new product with existing name as a admin', async () => {
        const existingProduct = await utils.find_product_by_name(randProductName) as ProductWithId;
        const [success, response] = await utils.post_product(adminToken, {
            nome: existingProduct.nome,
            preco: 100,
            descricao: 'Random product desc',
            quantidade: 100
        });
        expect(success).toBe(false);
        expect(response.status).toBe(400);
    })

    it('should update an existing product as a admin', async () => {
        const existingProduct = await utils.find_product_by_name(randProductName) as ProductWithId;
        const [success, response] = await utils.put_product(adminToken, existingProduct._id, {
            nome: randProductName + "_new_name",
            preco: 100,
            descricao: 'new desc',
            quantidade: 100
        });
        expect(success).toBe(true);
        expect(response.status).toBe(200);
    })

    it('should delete a product as a admin', async () => {
        const product = await utils.find_product_by_name(randProductName + "_new_name") as ProductWithId;
        const [success, response] = await utils.delete_product(adminToken, product._id);
        expect(success).toBe(true);
        expect(response.status).toBe(200);
    })
})