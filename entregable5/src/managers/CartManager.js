import fs from "fs"

export default class CartManager {
  constructor(path) {
    this.path = path
  }

  addCart = async (products) => {
    try {
      const carts = await manager.getCarts()
      const cart = {}

      if (!products)
        throw new Error(400)

      if (carts.length === 0) {
        cart.id = 1
      } else {
        cart.id = carts[carts.length - 1].id + 1
      }

      cart.products = products

      return "Carrito creado correctamente"
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = await fs.promises.readFile(this.path, "utf-8")
        const carts = JSON.parse(fileContent)
        return carts
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  getCartById = async (id) => {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = await this.getCarts()
        const cart = fileContent.find(cart => cart.id === id)

        if (!cart) throw new Error(404)

        return cart
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  addProductToCart = async (cartId, productId) => {
    try {
      const carts = await this.getCarts()
      const cartIndex = carts.findIndex(cart => cart.id === cartId)
      const cart = carts.find(cart => cart.id === cartId)

      if (cartIndex === -1)
        throw new Error(404)

      cart.products.forEach(product => {
        if (product.product === productId) {
          product.quantity++
        } else {
          const product = {
            product: productId,
            quantity: 1
          }
          cart.products.push(product)
        }
      })

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))

      return "Se agrego el producto al carrito"

    } catch (error) {
      console.log(error)
      return error.message
    }
  }
}