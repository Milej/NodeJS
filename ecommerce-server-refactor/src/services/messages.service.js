import Messages from "../dao/dbManagers/messages.manager.js";

const messagesManager = new Messages();

const getMessages = async () => {
  const messages = await messagesManager.getMessages();
  return messages;
};

const addMessage = async data => {
  const { user, message } = data;

  if (!user || !message) return { status: "error", message: "Debes completar todos los campos" };

  const result = await messagesManager.addMessage({ user, message });
  return result;
};

export { getMessages, addMessage };
