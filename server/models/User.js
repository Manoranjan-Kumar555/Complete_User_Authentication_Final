import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    password_otp: {
      otp: {
        type: String,
      },
      send_time: {
        type: String,
      },
      limit: {
        type: Number,
        default: 5,
      },
      last_attempt:{type:Object},
    },
  },
  { timestamps: true }
);

// Export using ES Modules
const User = mongoose.model("User", userSchema);
export default User;
