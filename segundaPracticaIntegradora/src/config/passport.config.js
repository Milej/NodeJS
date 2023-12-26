import passport from "passport";
import jwt from "passport-jwt";
import { PRIVATE_KEY_JWT } from "./constants.config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cokies) {
    token = req.cookies["token"];
  }
  return token;
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (error, user, info) {
        if (error) return next(error);

        if (!user) {
          return res.status(401).send({
            status: "error",
            message: info.messages ? info.messages : info.toString(),
          });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export { initializePassport, passportCall };
