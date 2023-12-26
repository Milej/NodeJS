import passport from "passport";
import jwt from "passport-jwt";
import { passportStrategies } from "./enums.js";
import { PRIVATE_KEY_JWT } from "./constants.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    passportStrategies.JWT,
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
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

export default initializePassport;
