import express from 'express'
import studentsRouter from './routes/students.router.js'
import coursesRouter from './routes/courses.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { __dirname } from './utils.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)

try {
  await mongoose.connect(
    'mongodb+srv://maxemestudioadmin:41089042Max@cursonodejs.mchxnmr.mongodb.net/practicaIntegradora?retryWrites=true&w=majority'
  )
  console.log('DB Connected')
} catch (error) {
  console.log(error)
}

app.listen(8080, console.log('Server running'))
