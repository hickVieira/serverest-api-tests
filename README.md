## Testing ServeRest API
This project tests the [ServeRest API](https://serverest.dev/).

### Tech
I decided to dump javascript, it is awful.
- Typescript
- Cypress
- Jest

### Running
```shell
npm i
npm run test
```

### Coverage
- Usuarios
    - [x] it should get all users
    - [x] it should get user by id
    - [x] it should return error message when user not found
    - [x] it should login successfully
    - [x] it should create a new user
    - [x] it should fail to create a new user with existing email
    - [x] it should update an existing user
    - [x] it should create a new user if updating a non-existent user
    - [x] it should delete a user
    - [ ] it should fail to delete a user with registered carts
- Produtos
    - [ ] it should get all products
    - [ ] it should get product by id
    - [ ] it should return error message when product not found
- Carrinhos
    - [ ] it should get all carts
    - [ ] it should get cart by id
    - [ ] it should return error message when cart not found