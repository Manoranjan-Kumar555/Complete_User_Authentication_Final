import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
  try {
    const mongoDbConnection = await mongoose.connect(process.env.MONGODB_CONNECT_URL, {
      dbName: "Complete_User_Authentication",
      useNewUrlParser: true,
      useUnifiedTopology: true, // optional but recommended
    });

    console.log(
      `Connected to MongoDB at: ${mongoDbConnection.connection.host}`
    );
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default dbConnection;
