/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Google,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IoPersonAdd } from "react-icons/io5";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Minimum 2 characters")
      .max(50, "Maximum 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain upper, lower, and number"
      )
      .required("Password is required"),
  });

  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5050/user/register",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Registration successful! Redirecting to login...");
      resetForm();
      navigate("/login");
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

  // Google OAuth redirect
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5050/auth/google";
  };

  return (
    <div className="auth_card">
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth_header">
                  <IoPersonAdd />
                  <p>Register New Account</p>
                  <span>Sign up to continue...</span>
                </div>

                <div className="col-12">
                  <TextField
                    name="name"
                    label="Name"
                    fullWidth
                    size="small"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={loading}
                  />
                </div>

                <div className="col-12">
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    size="small"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={loading}
                  />
                </div>

                <div className="col-12">
                  <TextField
                    name="password"
                    label="Password"
                    type={visible ? "text" : "password"}
                    fullWidth
                    size="small"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setVisible(!visible)}
                            edge="end"
                            disabled={loading}
                            aria-label="toggle password visibility"
                          >
                            {visible ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="col-12">
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading || isSubmitting}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Registering..." : "Register"}
                    {!loading && (
                      <span className="mx-2">
                        <FaArrowRightToBracket />
                      </span>
                    )}
                  </Button>
                </div>

                <div className="col-12">
                  <Divider>or</Divider>
                </div>

                <div className="col-12">
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<Google />}
                    disabled={loading}
                    onClick={loginWithGoogle}
                  >
                    Google
                  </Button>
                </div>

                <div className="col-12">
                  <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/login")}
                    disabled={loading}
                  >
                    Back to Login
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

export default Register;
