import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const Super = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const getUserAccess = async () => {
      try {
        const response = await axios.get("http://localhost:5050/user/getaccess", {
          withCredentials: true,
        });

        console.log("Access Response:", response);

        if (response?.data?.status) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Access Check Failed:", error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    getUserAccess();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default Super;
