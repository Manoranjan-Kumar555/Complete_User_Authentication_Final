import User from "../models/User.js";
import bcrypt from "bcrypt";

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    
    try {
        // Input validation
        if (!name || !email || !password) {
            const error = new Error("Name, email, and password are required");
            error.statusCode = 400;
            throw error;
        }

        // Email format validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const error = new Error("Please provide a valid email address");
            error.statusCode = 400;
            throw error;
        }

        // Password strength validation
        if (password.length < 6) {
            const error = new Error("Password must be at least 6 characters long");
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            const error = new Error("User already exists. Please try a different email.");
            error.statusCode = 409; // Conflict status code
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        
        // Remove password from response
        // const userResponse = {
        //     _id: savedUser._id,
        //     name: savedUser.name,
        //     email: savedUser.email,
        //     createdAt: savedUser.createdAt
        // };

        res.status(201).json({ // 201 for resource creation
            message: "User registered successfully",
            status: true,
            // user: userResponse
        });

    } catch (error) {
        // If it's a MongoDB duplicate key error
        if (error.code === 11000) {
            const duplicateError = new Error("User with this email already exists");
            duplicateError.statusCode = 409;
            return next(duplicateError);
        }
        
        // If it's a validation error from Mongoose
        if (error.name === 'ValidationError') {
            const validationError = new Error("Validation failed: " + Object.values(error.errors).map(e => e.message).join(', '));
            validationError.statusCode = 400;
            return next(validationError);
        }
        
        next(error);
    }
};

export default register;