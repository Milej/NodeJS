import { Router } from 'express'
import ProductsManager from '../../dao/dbManagers/products.manager.js'

const router = Router()
const manager = new ProductsManager()

router.get('/', async (req, res) => {
  try {
    const products = await manager.getAll()
    res.status(200).send({ status: 'success', payload: products })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await manager.getById(id)
    res.status(200).send({ status: 'success', payload: product })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, category } = req.body

    if (!title || !description || !code || !price || !category) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Faltan completar algunos campos' })
    }

    const result = await manager.add({
      title,
      description,
      code,
      price,
      category
    })

    res.status(201).send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, code, price, category } = req.body

    if (!title || !description || !code || !price || !category) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Faltan completar algunos campos' })
    }

    const result = await manager.update(id, {
      title,
      description,
      code,
      price,
      category
    })

    res.status(200).send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await manager.delete(id)
    res.status(200).send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

export default router
