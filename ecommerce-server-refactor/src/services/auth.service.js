import User from "../dao/dbManagers/users.manager.js";
import { hashPassword, generateToken, validatePassword } from "../utils.js";

const userManager = new User();

const getUser = async () => {
  const user = await userManager.getUser();
  return user;
};

const userRegister = async newUser => {
  const existsUser = await userManager.getUser(newUser.email);

  if (existsUser) {
    return { status: "error", message: "Usuario ya existe" };
  }

  const hashedPassword = hashPassword(newUser.password);
  newUser.password = hashedPassword;

  const createdUser = await userManager.addUser(newUser);

  delete createdUser.password;

  const accessToken = generateToken(createdUser);

  return accessToken;
};

const userLogin = async (email, password) => {
  const user = await userManager.getUser(email);

  if (!user) {
    return { status: "error", message: "El usuario no existe" };
  }

  const isValidPassword = validatePassword(password, user.password);
  if (!isValidPassword) {
    return { status: "error", message: "La contraseña es incorrecta" };
  }

  const { password: _, ...publicUser } = user;

  const accessToken = generateToken(publicUser);
  user.accessToken = accessToken;
  return user;
};

export { getUser, userRegister, userLogin };
