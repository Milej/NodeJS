import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const manager = new ProductManager('./src/files/Products.json')

router.get('/', async (req, res) => {
  const products = await manager.getProducts()
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  const io = req.app.get('socketio')
  const products = await manager.getProducts()

  io.on('connection', socket => {
    console.log('Cliente conectado')
    io.emit('showProducts', products)
  })
  res.render('realTimeProducts')
})

export default router
