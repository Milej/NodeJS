import passport from "passport";
import jwt from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/dbManagers/models/users.model.js";
import { passportStrategies } from "./enums.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["token"];
    }
    return token;
  };

  // Para logearse con github
  passport.use(
    passportStrategies.GITHUB,
    new GitHubStrategy(
      {
        clientID: "Iv1.ce0504c32fee9e66",
        clientSecret: "bb76dc97b688afa723e5a86fe0957049f224a073",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });

          if (!user) {
            // Registramos el usuario
            const newUser = {
              first_name: profile._json.name || "Nombre por defecto",
              last_name: "Apellido por defecto",
              age: 0,
              email,
              password: "github",
            };

            const result = await userModel.create(newUser);
            return done(null, result); //req.user
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(`Credenciales incorrectas. Error: ${error.message}`);
        }
      }
    )
  );

  // Con passport jwt
  passport.use(
    passportStrategies.JWT,
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), // Como obtener las cookies
        secretOrKey: process.env.PRIVATE_KEY_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user); //req.user
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export { initializePassport };
