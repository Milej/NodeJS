import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/dbManagers/models/users.model.js";
import { hashPassword, validatePassword } from "../utils.js";
import jwt from "passport-jwt";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  // Para el registro
  // passport.use(
  //   "register",
  //   new LocalStrategy(
  //     {
  //       passReqToCallback: true,
  //       usernameField: "email",
  //     },
  //     async (req, username, password, done) => {
  //       try {
  //         const { first_name, last_name, age } = req.body;
  //         const user = await userModel.findOne({ email: username });

  //         if (user) {
  //           return done(null, false);
  //         }

  //         const newUser = {
  //           first_name,
  //           last_name,
  //           email: username,
  //           age,
  //           password: hashPassword(password),
  //         };

  //         const result = await userModel.create(newUser);

  //         return done(null, result);
  //       } catch (error) {
  //         return done("Credenciales incorrectas");
  //       }
  //     }
  //   )
  // );

  // // Para el login
  // passport.use(
  //   "login",
  //   new LocalStrategy(
  //     {
  //       usernameField: "email",
  //     },
  //     async (username, password, done) => {
  //       try {
  //         if (
  //           username === "adminCoder@coder.com" &&
  //           password === "adminCod3r123"
  //         ) {
  //           const fakeUser = {
  //             first_name: `Coder`,
  //             last_name: "House",
  //             email: "adminCoder@coder.com",
  //             age: 1,
  //             role: "admin",
  //           };

  //           return done(null, fakeUser);
  //         } else {
  //           const user = await userModel.findOne({ email: username });

  //           if (!user)
  //             return res
  //               .status(400)
  //               .send({ status: "error", message: "Credenciales invalidas" });

  //           req.session.user = {
  //             name: `${user.first_name} ${user.last_name}`,
  //             email: user.email,
  //             age: user.age,
  //             role: user.role,
  //           };
  //         }

  //         if (!user || !validatePassword(password, user.password)) {
  //           return done(null, false);
  //         }
  //         return done(null, user);
  //       } catch (error) {
  //         return done("Credenciales incorrectas");
  //       }
  //     }
  //   )
  // );

  // Para logearse con github
  passport.use(
    "github",
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

  // passport.use(
  //   "jwt",
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: process.env.PRIVATE_KEY_JWT,
  //     },
  //     async (jwt_payload, done) => {
  //       try {
  //         return done(null, jwt_payload.user);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export { initializePassport };
