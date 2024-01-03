import { messagesModel } from './models/messages.model.js'

export default class Messages {
  constructor () {
    console.log('Working with messages')
  }

  getAll = async () => {
    const messages = await messagesModel.find().lean()
    return messages
  }

  add = async message => {
    const result = await messagesModel.create(message)
    return result
  }
}
