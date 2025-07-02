import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({ 'password_otp.otp': otp.toString() });

    if (!user) {
      const error = new Error("Invalid OTP.");
      error.statusCode = 400;
      throw error;
    }

    const currentTime = Date.now();
    const sendTime = new Date(user.password_otp.send_time).getTime();

    const isExpired = sendTime < currentTime;

    if (isExpired) {
      const error = new Error("OTP has expired.");
      error.statusCode = 400;
      throw error;
    }

    // Optional: clear OTP after successful verification
    user.password_otp.otp = null;
    user.password_otp.send_time = null;
    await user.save();

    // generate Token 
    const accessToken = generateToken(user.email);
    res.cookie("accessToken", accessToken);

    res.status(200).json({
      message: "OTP verified successfully.",
      status: true,
    });

  } catch (error) {
    next(error);
  }
};

export default verifyOTP;
