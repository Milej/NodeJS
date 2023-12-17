import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const validatePassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

export { __dirname, hashPassword, validatePassword };
