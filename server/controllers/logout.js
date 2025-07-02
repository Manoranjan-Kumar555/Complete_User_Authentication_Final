const logOut = async (req, res) => {
  try {
    // Clear the accessToken cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,        // true if using HTTPS
      sameSite: "None",    // Case-sensitive: "None" not "none"
      path: "/",           // Must match the path used when setting the cookie
    });

    res.status(200).json({
      message: "Logged out successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      message: "Logout failed.",
      status: false,
    });
  }
};

export default logOut;
