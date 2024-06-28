import { StatusCodes } from "http-status-codes";
import utils from "./utils";
import { Product, ProductWithId } from "./Product";

describe('Product tests', () => {

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
    })
})