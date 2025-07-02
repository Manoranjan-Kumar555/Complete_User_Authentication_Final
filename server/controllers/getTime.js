import User from "../models/User.js";

const getTime = async (req,res,next) =>{
    const {email} = req.body;
 try {

    const findedUser = await User.findOne({email:email});
    if(!findedUser){
        const error = new Error("Email not found... & Something went wrong...");
      error.statusCode = 400;
      throw error;
    }

    const time = findedUser.password_otp.send_time;
    res.status(200).json({
        message:"Resend OTP Sent Successfully",
        status:true,
        time
    })
    
 } catch (error) {
    next(error)
 }
}

export default getTime;