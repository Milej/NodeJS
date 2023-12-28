import { Router } from 'express'
import Messages from '../../dao/dbManagers/MessagesManager.js'

const router = Router()
const messagesManager = new Messages()

router.get('/', async (req, res) => {
  try {
    const messages = await messagesManager.getAll()
    res.send({ status: 'success', payload: messages })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body
    const result = await messagesManager.add({
      user,
      message
    })
    res.send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

export default router
