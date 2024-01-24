import { Router as expressRouter } from "express";
import passport from "passport";
import { passportStrategies, accessRoles } from "../config/enums.js";

export default class Router {
  constructor() {
    this.router = expressRouter();
    this.init(); // La idea de este metodo es que nuestra clase padre tenga la definición del método y las clases hijas tengan la implementación
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, strategy, ...callbacks) {
    this.router.get(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, strategy, ...callbacks) {
    this.router.post(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, strategy, ...callbacks) {
    this.router.put(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, strategy, ...callbacks) {
    this.router.delete(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (data) => {
      res.status(200).json({ data });
    };

    res.sendSuccessNewResource = (data) => {
      res.status(201).json({ data });
    };

    res.sendServerError = (error) => {
      res.status(500).json({ error });
    };

    res.sendClientError = (error) => {
      res.status(400).json({ error });
    };

    next();
  };

  // Middleware de autenticación con passport
  applyCustomPassportCall = (strategy) => (req, res, next) => {
    if (strategy === passportStrategies.JWT) {
      //custom passport callback
      passport.authenticate(
        strategy,
        { session: false },
        function (err, user, info) {
          if (err) return next(err);

          if (!user) {
            return res.status(401).send({
              error: info.messages ? info.messages : info.toString(),
            });
          }

          req.user = user;
          next();
        }
      )(req, res, next);
    } else {
      next();
    }
  };

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === accessRoles.PUBLIC) return next();

    const user = req.user;

    if (!policies.includes(user?.role.toUpperCase()))
      return res.status(403).json({ error: "Not permissions" });

    next();
  };

  applyCallbacks(callbacks) {
    // Mapear los callbacks 1 a 1 obteniendo sus parametros (req,res) -> ...params
    return callbacks.map((callback) => async (...params) => {
      try {
        // apply, va a ejecutar la funcion callback a la instancia de nuestra clase
        await callback.apply(this, params);
      } catch (error) {
        // res.status().send()
        params[1].status(500).send({ status: "error", message: error.message });
      }
    });
  }
}
