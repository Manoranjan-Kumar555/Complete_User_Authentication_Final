import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const error = new Error("No user found with this email.");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      const error = new Error("Incorrect password.");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = generateToken(findUser.email);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      status: true,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default login;
