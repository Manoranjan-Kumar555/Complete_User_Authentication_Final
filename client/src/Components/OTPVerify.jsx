/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import Countdown from "react-countdown";
import axios from "axios";
import toast from "react-hot-toast";

const OTPVerify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(2*60*1000);
  
  const resendOtpRequest = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5050/user/otp/time",
          { email: localStorage.getItem("email") },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("Resend Otp:", response);
        if(response?.status){
          const minutes = response?.data?.time - new Date().getTime();
          console.log("minutes :- ", minutes);
          setTimer(minutes)
        }
      } catch (err) {
        console.error("Resend OTP failed:", err);
      }
    };

  useEffect(() => {
    resendOtpRequest(); // ✅ call the function
  }, []);

  const resendOTP  = async()=>{
    try {
      // Make API call using Axios
     const response = await axios.post(
        "http://localhost:5050/user/password/forget",
        { email: localStorage.getItem("email") },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Response OTP", response);
      if(response?.status){
        resendOtpRequest(); // ✅ call the function
        toast.success(response?.data?.message);
        navigate("/otp/verify");
        localStorage.setItem();
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
  

  const initialState = {
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
  };

  const validationSchema = Yup.object(
    Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [`otp${i + 1}`, Yup.string().required()])
    )
  );

  const submitHandler = async (values) => {
    const otp = Object.values(values).join("");
    console.log("OTP Value:", otp);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5050/user/otp/verify",
        { otp }, // ✅ send as object, not JSON.stringify()
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("OTP Response:", response);
      if (response.data?.status) {
        toast.success(response.data.message);
        navigate("/password/update");
      } else {
        toast.error(response.data?.message || "Verification failed");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const otpArray = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];

  const inputChange = (value, setFieldValue, index, item) => {
    setFieldValue(item, value);
    if (value && index < otpArray.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index, setFieldValue, item) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
        otpArray.forEach((otpKey, idx) => {
          setFieldValue(otpKey, digits[idx] || "");
        });
        const lastIndex = Math.min(digits.length - 1, otpArray.length - 1);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  return (
    <div className="auth_card">
      <Formik
        onSubmit={submitHandler}
        validationSchema={validationSchema}
        initialValues={initialState}
      >
        {({ handleBlur, values, touched, errors, setFieldValue }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth_header">
                  <MdVerified />
                  <p>Verify OTP</p>
                  <span>
                    Enter the 6-digit OTP we just sent to your registration email.
                  </span>
                </div>
                <div className="col-12 otp_inputs">
                  {otpArray.map((item, index) => (
                    <TextField
                      key={item}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      value={values[item]}
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9]/g, "");
                        if (value.length <= 1) {
                          inputChange(value, setFieldValue, index, item);
                        }
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, setFieldValue, item)
                      }
                      inputProps={{
                        maxLength: 1,
                        pattern: "[0-9]*",
                        style: { textAlign: "center" },
                      }}
                      fullWidth
                      size="small"
                      type="text"
                      name={item}
                      onBlur={handleBlur}
                      error={touched[item] && Boolean(errors[item])}
                    />
                  ))}
                </div>
                <div className="col-12">
                  <Button
                    disabled={
                      Object.values(values).some((value) => value === "") || loading
                    }
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    {loading ? "VERIFYING..." : "VERIFY"}
                    <span className="mx-2">
                      <IoMdSend />
                    </span>
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
                <Countdown
                  renderer={({ minutes, seconds, completed }) => {
                    return completed ? (
                      <div className="col-12">
                        <Button endIcon={<ArrowForwardIcon />} variant="text"
                        onClick={resendOTP}>
                          RESEND
                        </Button>
                      </div>
                    ) : (
                      <span>
                        Resend OTP in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                    );
                  }}
                  date={Date.now() + timer}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OTPVerify;
