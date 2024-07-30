## testing serverest api
This project tests the [ServeRest API](https://serverest.dev/).

### quickrun script
```bash
mkdir serverest_api_tests &&
cd ./serverest_api_tests &&
git clone https://github.com/hickVieira/serverest-api-tests.git ./ &&
npm i &&
npm run test &&
cd ..
```

### tech
- Typescript
- Jest

### coverage
- Usuarios
    - [x] should get all users
    - [x] should get user by id
    - [x] should return error message when user not found
    - [x] should login successfully
    - [x] should create a new user
    - [x] should fail to create a new user with existing email
    - [x] should update an existing user
    - [x] should create a new user if updating a non-existent user
    - [x] should delete a user
    - [x] should fail to delete a user with registered carts
- Produtos
    - [x] should get all products
    - [x] should get product by id
    - [x] should return error message when product not found
    - [x] should create a new product as a admin
    - [x] should fail to create a new product with existing name as a admin
    - [x] should update an existing product as a admin
    - [x] should delete a product as a admin
- Carrinhos
    - [x] should get all carts
    - [x] should get a cart by id
    - [x] should post a cart as a user
    - [x] should submit a cart as a user
    - [x] should cancel a cart as a user