import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js'
import __dirname from './utils.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

try {
  await mongoose.connect(
    'mongodb+srv://maxemestudioadmin:41089042Max@cursonodejs.mchxnmr.mongodb.net/ecommerce?retryWrites=true&w=majority'
  )

  console.log('Database connected')
} catch (error) {
  console.log(error)
}

app.use('/api/products', productsRouter)

app.listen(8080, console.log('Server running on port 8080'))
