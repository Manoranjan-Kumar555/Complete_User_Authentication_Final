/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BiLogIn } from "react-icons/bi";
import {
  TextField,
  Button,
  InputAdornment,
  Icon,
  IconButton,
  Divider,
} from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ArrowBack, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useGenral from "../hooks/useGenral";


const Login = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [ loading, setLoading] = useState(false);


  const visibleHandle = () => {
    setVisible(!visible);
  };

  const initialState = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email...")
      .required("Email is Required..."),
    password: Yup.string().required("Password is Required..."),
  });

  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    console.log("Values Logiin :-", values);
    setLoading(true);
    try {
      // Make API call using Axios
     const response = await axios.post(
        "http://localhost:5050/user/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Login successful! Redirecting to Profile...");
      resetForm();
      navigate("/");

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };


  // google Authentication Login
  const loginWithGoogle = () =>{
    window.location.href = "http://localhost:5050/auth/google"
  }

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
                  <BiLogIn />
                  <p>Welcome Back</p>
                  <span>Login To Continue...</span>
                </div>
                <div className="col-12">
                  <TextField
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
                  <TextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={visibleHandle} edge="end">
                            {visible ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    type={visible ? "text" : "password"}
                    name="password"
                    label="Enter your Password."
                    fullWidth
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </div>
                <div className="col-12">
                  <Button variant="contained" fullWidth type="submit">
                    Login
                  </Button>
                </div>
                <div className="col-12">
                  <Divider>or</Divider>
                </div>
                <div className="col-12">
                  <Button variant="outlined" 
                  onClick={loginWithGoogle}fullWidth endIcon={<Google />}>
                   Google
                  </Button>
                </div>
                <div className="col-12">
                  <Button startIcon={<ArrowBack/>} variant="outlined" fullWidth
                  onClick={()=>navigate("/register")}>
                    Create new Account
                  </Button>
                </div>
                <div className="col-12">
                  <Button variant="text" color="error" fullWidth
                  onClick={()=>navigate("/forget")}>
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;