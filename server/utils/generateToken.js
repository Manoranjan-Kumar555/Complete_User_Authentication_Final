const jwt = require("jsonwebtoken");

const generateToken = (email) => {
    // Validate input
    if (!email) {
        throw new Error("Email is required to generate token");
    }
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not set");
    }
    
    try {
        const accessToken = jwt.sign(
            { email: email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );
        
        return accessToken;
    } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
    }
};

module.exports = generateToken;