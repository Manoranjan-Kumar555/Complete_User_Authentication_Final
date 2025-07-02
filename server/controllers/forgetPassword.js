import User from "../models/User.js";
import sendMaile from "../utils/sendMail.js";

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const findeduser = await User.findOne({ email });

    if (!findeduser) {
      const error = new Error("No user found with this email.");
      error.statusCode = 400;
      throw error;
    }

    // Ensure password_otp is initialized
    if (!findeduser.password_otp) {
      findeduser.password_otp = {
        otp: null,
        send_time: null,
        limit: 5,
        last_attempt: null,
      };
    }

    const now = Date.now();
    const lastAttemptTime = new Date(findeduser.password_otp.last_attempt || 0).getTime();
    const within24Hours = now - lastAttemptTime <= 24 * 60 * 60 * 1000;

    // Reset limit if outside 24h window
    if (!within24Hours) {
      findeduser.password_otp.limit = 5;
      await findeduser.save();
    }

    const hasReachedLimit = within24Hours && findeduser.password_otp.limit === 0;
    if (hasReachedLimit) {
      const error = new Error("Daily OTP limit reached. Try again after 24 hours.");
      error.statusCode = 400;
      throw error;
    }

    // Generate OTP
    const otpGenerate = Math.floor(Math.random() * 900000) + 100000;

    // Set OTP values
    findeduser.password_otp.otp = otpGenerate.toString();
    findeduser.password_otp.limit--;
    findeduser.password_otp.last_attempt = new Date();
    findeduser.password_otp.send_time = now + 2 * 60 * 1000; // valid after 2 minutes

    await findeduser.save();

    const data = {
      email,
      otp: otpGenerate,
    };

    const result = await sendMaile(data);
    // console.log("Email send result:", result);

    res.status(200).json({
      message: `OTP sent to ${email}`,
      status: true,
      otp: otpGenerate, // ⚠️ remove this in production
    });
  } catch (error) {
    next(error);
  }
};

export default forgetPassword;
