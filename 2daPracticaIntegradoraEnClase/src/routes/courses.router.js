import Router from "./router.js";
import Courses from "../dao/dbManagers/courses.manager.js";
import { accessRoles, passportStrategies } from "../config/enums.js";

export default class CoursesRouter extends Router {
  constructor() {
    super();
    this.coursesManager = new Courses();
  }

  init() {
    this.get("/", [accessRoles.ADMIN], passportStrategies.JWT, this.getAll);
    this.post("/", [accessRoles.ADMIN], passportStrategies.JWT, this.save);
  }

  async getAll(req, res) {
    try {
      const courses = await this.coursesManager.getAll();
      res.sendSuccess(courses);
    } catch (error) {
      console.log(error);
      return res.sendServerError(error.message);
    }
  }

  async save(req, res) {
    try {
      const { title, description, teacher } = req.body;
      if (!title || !description || !teacher) {
        return res.sendClientError("Valores incompletos");
      }

      const result = await this.coursesManager.save({
        title,
        description,
        teacher,
      });

      res.sendSuccessNewResource(result);
    } catch (error) {
      console.log(error);
      return res.sendServerError(error.message);
    }
  }
}
