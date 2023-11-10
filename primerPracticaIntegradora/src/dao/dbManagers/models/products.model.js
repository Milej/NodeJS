import mongoose from 'mongoose'

const productsCollection = 'products'
const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    required: true
  },
  thumbnail: {
    type: Array,
    default: []
  }
})

export const productsModel = mongoose.model(productsCollection, productsSchema)
