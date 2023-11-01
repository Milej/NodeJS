class ProductManager {

  constructor() {
    this.products = []
    this.title
    this.description
    this.price
    this.thumbnail
    this.code
    this.stock
  }

  addProduct(title, description, price, thumbnail, code, stock) {

    const productFind = this.products.find(item => item.code == code)

    if (productFind) return console.log("El producto ya existe")

    const autoId = this.products.length + 1

    const product = {
      id: autoId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    }

    this.products.push(product)

    return console.log(`Nuevo producto agregado con ID: ${product.id}`)

  }

  getProducts() {
    return console.log(this.products)
  }

  getProductById(productId) {
    return this.products.find(item => item.id == productId) ?? "Not found"
  }

}

const productManager = new ProductManager()
productManager.getProducts()
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
productManager.getProducts()
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(productManager.getProductById(1))
console.log(productManager.getProductById(2))