import { productsModel } from './models/products.model.js'

export default class Products {
  constructor () {
    console.log('Working with products')
  }

  getAll = async () => {
    const products = await productsModel.find().lean()
    return products
  }

  getById = async id => {
    const product = await productsModel.findOne({ _id: id }).lean()
    return product
  }

  add = async product => {
    const result = await productsModel.create(product)
    return result
  }

  update = async (id, product) => {
    const result = await productsModel.updateOne({ _id: id }, product)
    return result
  }

  delete = async id => {
    const result = await productsModel.deleteOne({ _id: id })
    return result
  }
}