import React, { useRef, useContext } from "react";

import classes from "./Login.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "../../utils/axios";

import AppContext from "../../contexts/app-context";

import { useNavigate } from "react-router-dom";

const Login = () => {
  let nameRef = useRef<HTMLInputElement>();
  let emailRef = useRef<HTMLInputElement>();

  const navigate = useNavigate();

  const appCtx = useContext(AppContext);

  const loginHandler = async () => {
    const request = await axios.post("/customer", {
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
    });

    appCtx.setUser(request.data);

    navigate("/overview");
  };

  const navigateToOverviewHandler = () => {
    navigate("/overview");
  };
  return (
    <div className={classes.login_container}>
      <div className={classes.login_img}>
        <img src={require("../../assets/login_logo.png")} alt="" />
      </div>

      {!appCtx.user.name ? (
        <div className={classes.login_text}>Log in</div>
      ) : (
        <>
          <div className={classes.login_text}>Already Logged In</div>
          <button
            className={classes.navigate_overview}
            onClick={navigateToOverviewHandler}
          >
            Go to Product Overview
          </button>
        </>
      )}

      {!appCtx.user.name && (
        <>
          <br />
          <TextField
            className={classes.user_field}
            id="name"
            label="Name"
            variant="standard"
            inputRef={nameRef}
          />
          <br />
          <TextField
            className={classes.user_field}
            id="email"
            label="Email address"
            variant="standard"
            inputRef={emailRef}
          />
          <br />
          <br />
          <Button
            className={classes.user_login}
            variant="contained"
            onClick={loginHandler}
          >
            Login
          </Button>
        </>
      )}
      <br />
      <br />
      <br />
    </div>
  );
};

export default Login;
