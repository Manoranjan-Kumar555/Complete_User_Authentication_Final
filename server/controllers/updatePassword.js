import User from "../models/User.js";
import bcrypt from "bcrypt";

const updatePassword = async (req, res, next) => {
  const { password, email } = req.body; // ❗ Extract email from req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // ❗ Make sure to find user using email from req.body or req.user (if using auth middleware)
    const userEmail = email || req.user?.email;
    if (!userEmail) {
      return res.status(400).json({
        message: "Email is required to update password",
        status: false,
      });
    }

    const findedUser = await User.findOne({ email: userEmail });
    
    if (!findedUser) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    findedUser.password = hashedPassword;
    await findedUser.save();

    // ✅ Clear auth cookies (if set)
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.clearCookie("connect-sid", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      message: "Password Updated Successfully...",
      status: true,
    });

  } catch (error) {
    next(error);
  }
};

export default updatePassword;
