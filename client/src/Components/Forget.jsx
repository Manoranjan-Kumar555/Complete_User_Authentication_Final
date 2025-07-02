/* eslint-disable no-unused-vars */
import React from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Icon,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import {
  ArrowBack,
  Google,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IoPersonAdd } from "react-icons/io5";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { MdOutlineRefresh } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useGenral from "../hooks/useGenral";

const Forget = () => {
  const navigate = useNavigate();
  // const [visible, setVisible] = useState(false);
  const [ loading, setLoading] = useState(false);
  

  const initialState = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email...")
      .required("Email is Required..."),
  });

  const submitHandler = async (values) => {
    console.log("Values verify Otp :-", values);
    setLoading(true);
     try {
      // Make API call using Axios
     const response = await axios.post(
        "http://localhost:5050/user/password/forget",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Response OTP", response);
      setLoading(false)
      if(response.status){
        toast.success(response?.data?.message);
        navigate("/otp/verify");
        localStorage.setItem("email", values.email);
      }

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
    // console.log("Register Values :-", values);
    // navigate("/otp/verify")
  };

  return (
    <div className="auth_card">
      <Formik
        onSubmit={submitHandler}
        validationSchema={validationSchema}
        initialValues={initialState}
      >
        {({ handleBlur, handleChange, values, touched, errors }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth_header">
                  <MdOutlineRefresh />
                  <p>Find Your Account</p>
                  <span>Enter Your Registered Email</span>
                </div>
                <div className="col-12">
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">@</InputAdornment>
                      ),
                    }}
                    name="email"
                    label="Enter your Email"
                    fullWidth
                    size="small"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>
                <div className="col-12">
                  <Button 
                  disabled={loading}
                  endIcon = {loading && <CircularProgress size={24} />}
                  variant="contained" fullWidth type="submit">
                    Send OTP <span></span>
                    <span className="mx-2">
                      <IoMdSend />
                    </span>
                  </Button>
                </div>
                <div className="col-12">
                  <Divider>or</Divider>
                </div>
              </div>
              <div className="col-12">
                <Button
                  startIcon={<ArrowBack />}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Forget;
