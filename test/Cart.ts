export class CartItemGet {
    idProduto: string
    quantidade: number
    precoUnitario: number

    constructor(idProduto: string, quantidade: number, precoUnitario: number) {
        this.idProduto = idProduto
        this.quantidade = quantidade
        this.precoUnitario = precoUnitario
    }
}

export class CartItemPost {
    idProduto: string
    quantidade: number

    constructor(idProduto: string, quantidade: number) {
        this.idProduto = idProduto
        this.quantidade = quantidade
    }
}

export class CartPost {
    produtos: CartItemPost[]

    constructor(produtos: CartItemPost[]) {
        this.produtos = produtos
    }
}

export class CartGet {
    public produtos: CartItemGet[]
    public precoTotal: number
    public quantidadeTotal: number
    public idUsuario: string
    public _id: string;

    constructor(produtos: CartItemGet[], precoTotal: number, quantidadeTotal: number, idUsuario: string, _id: string) {
        this.produtos = produtos
        this.precoTotal = precoTotal
        this.quantidadeTotal = quantidadeTotal
        this.idUsuario = idUsuario
        this._id = _id
    }
}