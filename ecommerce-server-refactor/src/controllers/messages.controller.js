import { getMessages as getMessagesService, addMessage as addMessageService } from "../services/messages.service.js";

const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesService();
    res.sendSuccess(messages);
  } catch (error) {
    return res.sendServerError(error.message);
  }
};

const addMessage = async (req, res) => {
  try {
    const result = await addMessageService(req.body);

    if (result.status === "error") return res.sendClientError(result.message);

    res.sendSuccess(result);
  } catch (error) {
    return res.sendServerError(error.message);
  }
};

export { getMessages, addMessage };
