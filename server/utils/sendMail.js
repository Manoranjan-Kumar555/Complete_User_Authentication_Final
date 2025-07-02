import nodemailer from "nodemailer";

const sendMaile = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // ✅ fixed typo
      auth: {
        user: process.env.APP_EMAIL, 
        pass: process.env.APP_PASSWORD,
      },
    });

    const otpString = data.otp.toString();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.email,
      subject: "Your Password Reset OTP",
      text: `Your OTP is: ${otpString}`,
      html: `<p>Your OTP is: <strong>${otpString}</strong></p>`, // optional HTML content
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: true, message: error.message }; // ensure error is handled
  }
};

export default sendMaile;
