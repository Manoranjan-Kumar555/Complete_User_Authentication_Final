import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      const error = new Error("Unauthorized...");
      error.statusCode = 403;
      throw error;
    }
    console.log("accessToken", accessToken)

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.email = decoded.email; // You can access `req.user.email` etc. in protected routes
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || "Unauthorized access.";
    next(error);
  }
};

export default auth;
