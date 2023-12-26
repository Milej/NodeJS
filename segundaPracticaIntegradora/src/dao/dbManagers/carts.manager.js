import { cartsModel } from './models/carts.model.js'

export default class Carts {
  constructor () {
    console.log('Working with Carts')
  }

  getAll = async () => {
    const carts = await cartsModel.find().lean()
    return carts
  }

  getById = async id => {
    const cart = await cartsModel.findOne({ _id: id }).lean()
    return cart
  }

  add = async cart => {
    const result = await cartsModel.create(cart)
    return result
  }

  update = async (id, cart) => {
    const result = await cartsModel.updateOne({ _id: id }, cart)
    return result
  }

  delete = async id => {
    const result = await cartsModel.deleteOne({ _id: id })
    return result
  }
}
