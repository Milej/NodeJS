import { cartsModel } from './models/carts.model.js'

export default class Carts {
  constructor () {
    console.log('Working with Cars')
  }

  getAll = async () => {
    const carts = await cartsModel.find().lean()
    return carts
  }

  getById = async id => {
    const cart = await cartsModel.findOne({ _id: id }).lean()
    return cart
  }

  add = async products => {
    const result = await cartsModel.create({ products })
  }

  update = async (id, products) => {
    const result = await cartsModel.updateOne({ _id: id }, products)
  }
}
