import React, { useEffect, useState } from "react";
import { Avatar, Button, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:5050/user/profile", {
          withCredentials: true, // required for cookie-based auth
        });

        console.log("Full Profile Response:", response);

        setUser(response.data.user); // expects { user: { name, email } }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

 const handleLogout = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5050/user/logout",
      {
        withCredentials: true, // Correct placement here
      }
    );

    console.log("Logout Response:", response);

    toast.success("Logged out successfully.");

    if (response?.status === 200) {
      navigate("/login");
    }
  } catch (error) {
    console.error("Logout Error:", error);
    toast.error("Logout failed.");
  }
};


  if (loading) {
    return (
      <div className="auth_card text-center">
        <CircularProgress />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth_card text-center">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="auth_card">
      <div className="profile_container text-center">
        <Avatar
          sx={{ bgcolor: "red", textTransform: "capitalize", margin: "0 auto" }}
        >
          {user.name?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <span className="full_name">{user.name}</span>
        <span className="email">{user.email}</span>
      </div>

      <div className="col-12 mt-3">
        <Button
          onClick={handleLogout}
          endIcon={<LogoutIcon />}
          variant="contained"
          fullWidth
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
