const { ProductManager } = require("./managers/ProductManager.js")

const manager = new ProductManager("./files/Productos.json")

const productoPrueba = {
  title: "Producto de prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
}

const buscarProducto = 1
const editarProducto = 2
const eliminarProducto = 3

const env = async () => {

  const productos = await manager.getProducts()

  console.log(productos)

  await manager.addProduct(productoPrueba)

  const productosNuevamente = await manager.getProducts()

  console.log(productosNuevamente)

  const soloUnProducto = await manager.getProductById(buscarProducto)

  console.log(soloUnProducto)

  await manager.updateProduct(editarProducto, "title", "Producto de pureba editado")

  await manager.deleteProduct(eliminarProducto)

}

env()