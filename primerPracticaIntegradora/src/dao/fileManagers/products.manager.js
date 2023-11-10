import fs from "fs"

export default class ProductManager {

  constructor(path) {
    this.path = path
  }

  addProduct = async (product) => {
    try {

      if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
        throw new Error(400)
      }

      const products = await this.getProducts()

      if (products.length === 0) {
        product.id = 1
      } else {
        product.id = products[products.length - 1].id + 1
      }

      products.push(product)

      await fs.promises.writeFile(this.path, JSON.stringify(products), null, "\t")

      return "Producto creado correctamente"
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = await fs.promises.readFile(this.path, "utf-8")
        const products = JSON.parse(fileContent)
        return products
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  getProductById = async (id) => {
    try {
      const products = await this.getProducts()

      const findProduct = products.find(p => p.id === id)

      if (!findProduct)
        throw new Error(404)

      return findProduct
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  updateProduct = async (id, product) => {
    try {

      const products = await this.getProducts()
      const productIndex = products.findIndex(p => p.id === id)

      if (productIndex === -1)
        throw new Error(404)

      if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category)
        throw new Error(400)

      products[productIndex] = product
      product.id = id

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))

      return `Producto ${id} editado correctamente`

    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts()

      const productIndex = products.findIndex(p => p.id === id)

      if (productIndex === -1)
        throw new Error(404)

      products.splice(productIndex, 1)

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))

      return "Producto eliminado"

    } catch (error) {
      console.log(error)
      return error.message
    }
  }
} 