import { Router } from 'express'
import Students from '../dao/dbManagers/students.manager.js'

const router = Router()
const studentsManager = new Students()

router.get('/', async (req, res) => {
  try {
    const students = await studentsManager.getAll()
    res.status(200).send({ status: 'success', payload: students })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, dni, birth_date, gender } = req.body

    if (!first_name || !last_name || !email) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Valores incompletos' })
    }

    const result = await studentsManager.save({
      first_name,
      last_name,
      email,
      dni,
      birth_date,
      gender
    })

    res.status(201).send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

export default router
