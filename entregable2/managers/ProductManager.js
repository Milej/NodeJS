const fs = require("fs")

class ProductManager {

  constructor(path) {
    this.path = path
  }

  addProduct = async (producto) => {
    try {
      const productos = await this.getProducts()

      if (productos.length === 0) {
        producto.id = 1
      } else {
        producto.id = productos[productos.length - 1].id + 1
      }

      productos.push(producto)

      await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"))

      return producto

    } catch (error) {
      console.log(error)
    }
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const datos = await fs.promises.readFile(this.path, "utf-8")
        const productos = JSON.parse(datos)
        return productos
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  getProductById = async (id) => {
    try {
      const productos = await this.getProducts()

      const buscarProducto = productos.find(producto => producto.id === id)

      if (!buscarProducto) throw new Error("No existe un producto con ese ID")

      return buscarProducto
    } catch (error) {
      console.log(error)
    }
  }

  updateProduct = async (id, prop, valor) => {
    try {
      const productos = await this.getProducts()

      const productoAEditar = productos.find(p => p.id === id)

      if (!productoAEditar) return "No existe el producto con ese ID"

      productoAEditar[prop] = valor

      await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"))

      return `Producto ${id} editado`

    } catch (error) {
      console.log(error)
    }
  }

  deleteProduct = async (id) => {
    try {
      const productos = await this.getProducts()

      const productoAEliminar = productos.find(producto => producto.id === id)

      if (!productoAEliminar) throw new Error("No existe un producto con ese ID")

      const productosActualizados = productos.filter(producto => producto.id != id)

      await fs.promises.writeFile(this.path, JSON.stringify(productosActualizados, null, "\t"))

      return `${productoAEliminar.title} eliminado`

    } catch (error) {
      console.log(error)
    }
  }

}
module.exports = {
  ProductManager
}