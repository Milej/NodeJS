import { Router } from 'express'
import Products from '../../dao/dbManagers/products.manager.js'
import Messages from '../../dao/dbManagers/messages.manager.js'
import Carts from '../../dao/dbManagers/carts.manager.js'

const router = Router()
const productsManager = new Products()
const messagesManager = new Messages()
const cartsManager = new Carts()

router.get('/products', async (req, res) => {
  const products = await productsManager.getAll()
  res.render('products', { products })
})

router.get('/chat', async (req, res) => {
  const messages = await messagesManager.getAll()
  res.render('chat', { messages })
})

router.get('/carts', async (req, res) => {
  const carts = await cartsManager.getAll()
  res.render('carts', { carts })
})

export default router
