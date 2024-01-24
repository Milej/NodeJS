import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const validatePassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.PRIVATE_KEY_JWT, {
    expiresIn: "24h",
  });
  return token;
};

export { __dirname, hashPassword, validatePassword, generateToken };
