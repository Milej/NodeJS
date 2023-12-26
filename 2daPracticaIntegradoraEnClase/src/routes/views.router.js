import Courses from "../dao/dbManagers/courses.manager.js";
import Students from "../dao/dbManagers/students.manager.js";
import Router from "./router.js";
import { accessRoles, passportStrategies } from "../config/enums.js";

export default class ViewsRouter extends Router {
  constructor() {
    super();
    this.studentsManager = new Students();
    this.coursesManager = new Courses();
  }

  init() {
    this.get(
      "/students-view",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.studentsView
    );
    this.get(
      "/courses-view",
      [accessRoles.PUBLIC],
      passportStrategies.NOTHING,
      this.studentsCourses
    );
  }

  async studentsView(req, res) {
    try {
      const students = await this.studentsManager.getAll();
      res.render("students", { students });
    } catch (error) {
      console.log(error);
    }
  }

  async studentsCourses(req, res) {
    try {
      const courses = await this.coursesManager.getAll();
      res.render("courses", { courses });
    } catch (error) {
      console.log(error);
    }
  }
}
