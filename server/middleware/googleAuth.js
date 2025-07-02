import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const googleAuth = async (req, res, next) => {
  try {
    let savedUser;
    const findedUser = await User.findOne({ email: req.user?._json?.email });
    if (!findedUser) {
      const newUser = new User({
        name: req.user?._json?.name,
        email: req.user?._json?.email
      })
      savedUser = await newUser.save();
    }
    const accessToken = generateToken(findedUser ? findedUser.email : savedUser.email);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" });
    console.log("token: - ", accessToken)
    next();
  } catch (error) {
    next(error);
  }
};

export default googleAuth;
