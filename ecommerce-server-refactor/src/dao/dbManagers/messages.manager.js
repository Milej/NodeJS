import { messagesModel } from "./models/messages.model.js";

export default class Messages {
  constructor() {
    console.log("Working messages with db");
  }

  async getMessages() {
    const messages = await messagesModel.find().lean();
    return messages;
  }

  async addMessage(message) {
    const result = await messagesModel.create(message);
    return result;
  }
}
