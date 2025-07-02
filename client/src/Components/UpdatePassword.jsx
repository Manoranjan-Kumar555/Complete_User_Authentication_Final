/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const visibleHandle = () => setVisible(!visible);

  const initialState = {
    password: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"),
  });

  const submitHandler = async (values) => {
  console.log("Update Password Value:", values);
  try {
    const response = await axios.post(
      "http://localhost:5050/user/password/update",
      {
        password: values.password,
        email: localStorage.getItem("email"), // ✅ add email from localStorage
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log("Response Updated Password:", response);

    if (response?.data?.status) {
      toast.success(response.data.message);
      navigate("/login");
    } else {
      toast.error(response.data?.message || "Failed to update password");
    }

  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Update password failed. Try again.";
    toast.error(msg);
  }
};


  return (
    <div className="auth_card">
      <Formik
        onSubmit={submitHandler}
        validationSchema={validationSchema}
        initialValues={initialState}
      >
        {({
          handleBlur,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth_header">
                  <RxUpdate />
                  <p>Update Your Password</p>
                  <span>Create your new password.</span>
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
                    label="Enter your password"
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
                    Update Password
                  </Button>
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePassword;
