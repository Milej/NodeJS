import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const manager = new ProductManager('./src/files/Products.json')

router.get('/', async (req, res) => {
  // Listar todos los productos con limit
  let { limit } = req.query
  const products = await manager.getProducts()
  const productsLimit = []

  if (limit > products.length) limit = products.length

  for (let i = 0; i < limit; i++) {
    const product = products[i]
    productsLimit.push(product)
  }

  if (limit) {
    res.send({ productosLimitados: productsLimit })
  } else {
    res.send({ productos: products })
  }
})

router.get('/:pid', async (req, res) => {
  // Traer solo el producto con el id proporcionado
  const productId = Number(req.params.pid)
  const response = await manager.getProductById(productId)

  if (response === '404')
    return res
      .status(404)
      .send({ status: 'error', message: 'Producto no encontrado' })

  res.send(response)
})

router.post('/', async (req, res) => {
  const product = req.body
  const response = await manager.addProduct(product)

  if (response === '400')
    return res
      .status(400)
      .send({ status: 'error', message: 'Valores incompletos' })

  const io = req.app.get('socketio')

  io.emit('showProducts', await manager.getProducts())
  res.status(201).send({ status: 'success', payload: response })
  // {
  //   id -> autogenerado, title, description, code, price -> Number, status -> Boolean, stock -> Number, category, thumbnail -> Array
  // }
})

router.put('/:pid', async (req, res) => {
  // Actualizar el producto sin eliminiar o modificar el id
  const productId = Number(req.params.pid)
  const product = req.body

  const response = await manager.updateProduct(productId, product)

  if (response === '400') {
    return res
      .status(400)
      .send({ status: 'error', message: 'Valores incompletos' })
  } else if (response === '404') {
    return res
      .status(404)
      .send({ status: 'error', message: 'Producto no encontrado' })
  }

  res.send({ status: 'success', payload: response })
})

router.delete('/:pid', async (req, res) => {
  const productId = Number(req.params.pid)

  const response = await manager.deleteProduct(productId)

  if (response === '404') {
    return res
      .status(404)
      .send({ status: 'error', message: 'Producto no encontrado' })
  }

  res.send({ status: 'success', payload: response })
})

export default router
