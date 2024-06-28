export class Product {
    public nome: string;
    public preco: number;
    public descricao: string;
    public quantidade: number;

    constructor(nome: string, preco: number, descricao: string, quantidade: number) {
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.quantidade = quantidade;
    }
}

export class ProductWithId extends Product {
    public _id: string;

    constructor(id: string, nome: string, preco: number, descricao: string, quantidade: number) {
        super(nome, preco, descricao, quantidade);
        this._id = id;
    }
}