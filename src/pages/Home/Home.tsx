import React from "react";
import Header from "../../components/Header/Header";
import Products from "../../components/Products/Products";

import classes from "./Home.module.css";
const Home = () => {
  return (
    <>
      <Header />
      <div className={classes.home}>
        <div className={classes.home__banner}>
          <h1>Enjoy unlimited digital access</h1>
          <h2>Read trusted, award-winning journalism</h2>
        </div>
        <Products />
      </div>
    </>
  );
};

export default Home;
