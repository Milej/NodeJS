import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import User from "../models/User.js";
import { hashPassword, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Para el registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const user = await User.findOne({ email: username });

          if (user) {
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: hashPassword(password),
          };

          const result = await User.create(newUser);

          return done(null, result);
        } catch (error) {
          return done("Credenciales incorrectas");
        }
      }
    )
  );

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
          const user = await User.findOne({ email });

          if (!user) {
            // Registramos el usuario
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 0,
              email,
              password: "",
            };

            const result = await User.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Credenciales incorrectas");
        }
      }
    )
  );

  // Para el login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });

          if (!user || !validatePassword(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done("Credenciales incorrectas");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default initializePassport;
