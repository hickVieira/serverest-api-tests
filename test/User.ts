export class User {
    public nome: string;
    public email: string;
    public password: string;
    public administrador: string;

    constructor(nome: string, email: string, password: string, administrador: string) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.administrador = administrador;
    }
}

export class UserWithId extends User {
    public _id: string;

    constructor(id: string, nome: string, email: string, password: string, administrador: string) {
        super(nome, email, password, administrador);
        this._id = id;
    }
}