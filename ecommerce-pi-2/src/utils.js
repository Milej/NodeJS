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

const authToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken)
    return res
      .status(401)
      .send({ status: "error", message: "Not authenticated" });

  const token = authToken.split(" ")[1];

  jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, credentials) => {
    if (error)
      return res.status(401).send({ status: "error", message: error.message });

    req.user = credentials.user;

    next();
  });
};

export { __dirname, hashPassword, validatePassword, generateToken, authToken };
