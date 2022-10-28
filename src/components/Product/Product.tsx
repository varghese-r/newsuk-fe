import React, { useContext } from "react";

import classes from "./Product.module.css";

import AppContext from "../../contexts/app-context";

import { useNavigate } from "react-router-dom";

interface metadata {
  trial: string;
  trial_msg: string;
  popular: string;
  payment_msg: string;
  features_avl: string;
  features_not_avl?: string;
}
export interface ProdProp {
  name: string;
  prod_id: string;
  price_id: string;
  description: string;
  metadata: metadata;
}
const Product: React.FC<ProdProp> = ({
  name,
  prod_id,
  price_id,
  description,
  metadata,
}) => {
  const navigate = useNavigate();

  const appCtx = useContext(AppContext);

  // Payment Request

  // Payment Request End

  const createSubscriptionHandler = async () => {
    if (!appCtx.user.name) {
      navigate("/login");
    } else {
      appCtx.setSelectedProduct({ prod: prod_id, price: price_id });

      navigate("/checkout");
    }
  };

  return (
    <div className={classes.product_container}>
      {metadata.popular === "true" ? (
        <div className={classes.popular_tag}>MOST POPULAR</div>
      ) : (
        <div className={classes.normal_tag}></div>
      )}
      <div
        className={`${classes.product} ${
          metadata.popular === "true" ? classes.popular_product : ""
        }`}
      >
        <div className={classes.product_name}>{name}</div>
        <div className={classes.product_description}>{description}</div>
        <div className={classes.product_trialMsg}>{metadata.trial_msg}</div>
        <button
          className={`${classes.product_startBtn} ${
            metadata.popular === "true" ? classes.popular_Btn : ""
          }`}
          onClick={createSubscriptionHandler}
        >
          {+metadata.trial > 0 ? "Start Trial" : "Subscribe Now"}
        </button>
        <div className={classes.product_paymentMsg}>{metadata.payment_msg}</div>
        <p className={classes.included_msg}>WHAT'S INCLUDED</p>
        <ul className={classes.product_featList}>
          {metadata.features_avl.split(" | ").map((item, index) => (
            <div key={index} className={classes.product_featureItem}>
              <span className={`${classes.tick}`}>&#10003;</span>
              <div className={classes.product_featAvl}>{item}</div>
            </div>
          ))}
          {metadata.features_not_avl?.split(" | ").map((item, index) => (
            <div key={index} className={classes.product_featureItem}>
              <span className={`${classes.cross}`}>&#9587;</span>
              <li className={classes.product_featNotAvl}>{item}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Product;
