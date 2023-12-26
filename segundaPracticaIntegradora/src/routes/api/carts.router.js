import { Router } from 'express'
import Carts from '../../dao/dbManagers/carts.manager.js'

const router = Router()
const cartsManager = new Carts()

router.get('/', async (req, res) => {
  try {
    const carts = await cartsManager.getAll()
    res.send({ status: 'success', payload: carts })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const cart = await cartsManager.getById(id)
    res.send({ status: 'success', payload: cart })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { products } = req.body
    const cart = {}
    cart.products = products
    const result = await cartsManager.add(cart)
    res.send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

export default router
