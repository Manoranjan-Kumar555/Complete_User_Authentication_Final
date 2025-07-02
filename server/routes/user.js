import express from  "express";
import register from "../controllers/register.js";
import login from "../controllers/login.js"
import auth from "../middleware/auth.js"
import getUser from "../controllers/getUser.js";
import logOut from "../controllers/logout.js"
import getAccess from "../controllers/getAccess.js"
import forgetPassword from "../controllers/forgetPassword.js";
import verifyOTP from "../controllers/verifyOTP.js";
import getTime from "../controllers/getTime.js"
import updatePassword from "../controllers/updatePassword.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUser);
router.get("/logout", logOut);
router.get("/getaccess", auth, getAccess);
router.post("/password/forget", forgetPassword);
router.post("/otp/verify", verifyOTP);
router.post("/otp/time", getTime);
router.post("/password/update",auth, updatePassword);

export default router;