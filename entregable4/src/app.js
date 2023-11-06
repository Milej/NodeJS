import express, { urlencoded } from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

const server = app.listen(
  8080,
  console.log('Servidor corriendo en el puerto 8080')
)

const io = new Server(server)

app.set('socketio', io)
