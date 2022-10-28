import React, { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import classes from "./SetupForm.module.css";

import AppContext from "../../contexts/app-context";

import axios from "../../utils/axios";

import { useNavigate } from "react-router-dom";

const SetupForm = () => {
  const appCtx = useContext(AppContext);
  const stripe = useStripe();
  const elements = useElements();
  let navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [subscriptionIsActive, setSubscriptionIsActive] = useState(false);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // { error }
    const response = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
    });

    if (response.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(response.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      //   console.log(response);
      appCtx.setPaymentMethod(response.setupIntent.payment_method);

      const request = await axios.post("/create_subscription", {
        user: appCtx.user,
        price_id: appCtx.selectedProduct.price,
        payment_method: response.setupIntent.payment_method,
      });

      console.log(request.data.status);
      if (request.data.status === "active") {
        console.log("From setupform -", appCtx);
        setSubscriptionIsActive(true);
        console.log("subscriptionIsActive - ", subscriptionIsActive);
      }
    }
  };

  console.log("subscriptionIsActive - ", subscriptionIsActive);

  const handleNavigateToUserProfile = () => {
    navigate("/user");
  };

  return (
    <>
      {!subscriptionIsActive && (
        <form className={classes.paymentForm} onSubmit={handleSubmit}>
          <PaymentElement />
          <button className={classes.submitBtn} disabled={!stripe}>
            Submit
          </button>
          {errorMessage && (
            <div className={classes.errorMessage}>{errorMessage}</div>
          )}
        </form>
      )}
      {subscriptionIsActive && (
        <>
          <p>Your subscription to the product is now active</p>
          <button
            className={classes.userProfileButton}
            onClick={handleNavigateToUserProfile}
          >
            Go to user Profile
          </button>
        </>
      )}
    </>
  );
};

export default SetupForm;
