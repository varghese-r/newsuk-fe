import React, { useEffect, useContext, useState } from "react";

import Header from "../../components/Header/Header";

import classes from "./Checkout.module.css";

import AppContext from "../../contexts/app-context";

import axios from "../../utils/axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SetupForm from "../../components/SetupForm/SetupForm";

const stripePromise = loadStripe(
  "pk_test_51Jw3UpHciXopN8IpxX0gfmfWroOGi9d9XRuDlpH9bqRCt0g9ykocNmpe0uDKnBTv2KHTYUQHaGdKs7z42zUGwZEs00M6FVmlJx"
);

const Checkout = () => {
  const [prod, setProd] = useState();

  const [clientSecret, setClientSecret] = useState("");
  const [showPaymentElement, setShowPaymentElement] = useState(true);
  const appCtx = useContext(AppContext);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Inside if statement");
      if (!appCtx.paymentMethod) {
        const request = await axios.post("/product", {
          product: appCtx.selectedProduct,
          user: appCtx.user,
          payment_method: appCtx.paymentMethod,
        });

        setProd({
          name: request.data.product.name,
          description: request.data.product.description,
          metadata: request.data.product.metadata,
          price_id: request.data.product.default_price,
          prod_id: request.data.product.id,
        });

        if (request.data.client_secret) {
          setClientSecret(request.data.client_secret);
        }
      } else {
        console.log("Checkout appCtx - ", appCtx);
        console.log("Payment Method Already exists!!");
        setShowPaymentElement(false);
      }
    };

    fetchProduct();
  }, []);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <>
      <Header />
      <div className={classes.checkout__container}>
        <div className={classes.checkout__productSection}>
          <div className={classes.productSection__title}>
            Product Description
          </div>
          <div className={classes.productSection__name}>{prod?.name}</div>
          <div className={classes.productSection__description}>
            {prod?.description}
          </div>
          <div className={classes.productSection__price}>
            {prod?.metadata.payment_msg}
          </div>
          <div className={classes.productSection__features}>
            Features -
            <ul>
              {prod?.metadata.features_avl.split(" | ").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.checkout__paymentSection}>
          <div className={classes.paymentSection__title}>Payment Details</div>

          {clientSecret && showPaymentElement && (
            <>
              <Elements stripe={stripePromise} options={options}>
                <SetupForm />
              </Elements>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
