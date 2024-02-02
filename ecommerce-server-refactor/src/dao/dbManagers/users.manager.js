import { userModel } from "./models/users.model.js";

export default class Users {
  constructor() {
    console.log("Working users with DB");
  }

  async getUser(email) {
    const user = await userModel.findOne({ email }).lean();
    return user;
  }

  async addUser(user) {
    const result = (await userModel.create(user)).toJSON();
    return result;
  }
}
