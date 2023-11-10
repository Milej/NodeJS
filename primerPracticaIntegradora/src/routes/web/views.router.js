import { Router } from 'express'
import Products from '../../dao/dbManagers/products.manager.js'
import Messages from '../../dao/dbManagers/messages.manager.js'

const router = Router()
const productsManager = new Products()
const messagesManager = new Messages()

router.get('/products', async (req, res) => {
  const products = await productsManager.getAll()
  res.render('products', { products })
})

router.get('/chat', async (req, res) => {
  const messages = await messagesManager.getAll()
  res.render('messages', { messages })
})
export default router
