import { Router } from 'express'
import Courses from '../dao/dbManagers/courses.manager.js'

const router = Router()
const coursesManager = new Courses()

router.get('/', async (req, res) => {
  try {
    const courses = await coursesManager.getAll()
    res.status(200).send({ status: 'success', payload: courses })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, teacher } = req.body
    if (!title || !description || !teacher) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Valores incompletos' })
    }

    const result = await coursesManager.save({
      title,
      description,
      teacher
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
    const { title, description, teacher } = req.body
    if (!title || !description || !teacher) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Valores incompletos' })
    }

    const result = await coursesManager.update(id, {
      title,
      description,
      teacher
    })

    res.status(200).send({ status: 'success', payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: error.message })
  }
})

export default router
