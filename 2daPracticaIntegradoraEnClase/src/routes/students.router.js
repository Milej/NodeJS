import Students from "../dao/dbManagers/students.manager.js";
import Router from "./router.js";
import { accessRoles, passportStrategies } from "../config/enums.js";

export default class StudentsRouter extends Router {
  constructor() {
    super();
    this.studentsManager = new Students();
  }

  init() {
    this.get("/", [accessRoles.USER], passportStrategies.JWT, this.getAll);
    this.post("/", [accessRoles.ADMIN], passportStrategies.JWT, this.save);
  }

  async getAll(req, res) {
    try {
      const students = await this.studentsManager.getAll();
      res.sendSuccess(students);
    } catch (error) {
      return res.sendServerError(error.message);
    }
  }

  async save(req, res) {
    try {
      const { first_name, last_name, email, dni, birth_date, gender } =
        req.body;

      if (!first_name || !last_name || !email) {
        return res.sendClientError("Valores incompletos");
      }

      const result = await this.studentsManager.save({
        first_name,
        last_name,
        email,
        dni,
        birth_date,
        gender,
      });

      res.sendSuccessNewResource(result);
    } catch (error) {
      return res.sendServerError(error.message);
    }
  }
}
