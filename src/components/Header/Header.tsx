import React, { useContext } from "react";

import classes from "./Header.module.css";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

import AppContext from "../../contexts/app-context";

const Header = () => {
  const appCtx = useContext(AppContext);
  let navigate = useNavigate();

  const loginNavHandler = () => {
    if (appCtx.user.name) {
      navigate("/user");
    } else {
      navigate("/login");
    }
  };

  const handleSubscrOptions = () => {
    navigate("/overview");
  };

  return (
    <div className={classes.header}>
      <div className={classes.img__div}>
        <img src={require("../../assets/logo.png")} alt="" />
      </div>
      <div className={classes.options} onClick={handleSubscrOptions}>
        <p>Subscription Options</p>
      </div>

      <div className={classes.options}>
        <p>Why Subscribe?</p>
      </div>
      <div className={classes.login}>
        <div className={classes.login__button} onClick={loginNavHandler}>
          <PersonIcon />
          {!appCtx.user.name ? <p>Login</p> : <p>{appCtx.user.name}</p>}
        </div>
      </div>
    </div>
  );
};

export default Header;
