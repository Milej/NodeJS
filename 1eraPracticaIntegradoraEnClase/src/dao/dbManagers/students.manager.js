import { studentsModel } from './models/students.model.js'

export default class Students {
  constructor () {
    console.log('Working students with db')
  }

  getAll = async () => {
    const students = await studentsModel.find()

    //Transforma de BSON A POJO
    return students.map(student => student.toObject())
  }

  save = async student => {
    const result = await studentsModel.create(student)
    return result
  }
}
