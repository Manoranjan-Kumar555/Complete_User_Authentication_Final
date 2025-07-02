import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnection from "./db/dbConnection.js"; // Note the `.js` extension for ESM
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import googleAuth from "./middleware/googleAuth.js";
import userRouter from "./routes/user.js";
import errorHandler from "./middleware/errorHandler.js"

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });



// Middleware setup
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // or use process.env.FRONTEND_URL
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

// ------------ Google Authentication --------
// google login Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5050/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("Google Profile :- ", profile);
      // User login/register logic here
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),

  googleAuth,
  (req, res, next) => {
    res.redirect("http://localhost:5173/");
  }
);
// ------------ Google Authentication --------

// Health check route
app.get("/test", (req, res) => {
  const formattedDateTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  res.json({
    success: true,
    message:
      "Welcome! to 'Complete_User_Authentication' for testing purposes only!",
    datetime: formattedDateTime,
  });
});

app.use("/user", userRouter); // user/register


// error Handler
app.use(errorHandler);

// Connect to DB
dbConnection();
export default app;
