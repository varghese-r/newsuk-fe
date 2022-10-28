import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";

import classes from "./User.module.css";

import AppContext from "../../contexts/app-context";

import axios from "../../utils/axios";

const User = () => {
  const appCtx = useContext(AppContext);
  const [productName, setProductName] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState();
  const [subscriptionIsActive, setSubscriptionIsActive] = useState(false);
  const [showPauseSection, setShowPauseSection] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [disablePause, setDisablePause] = useState(false);
  const [showPauseMsg, setShowPauseMsg] = useState(false);
  const [pauseTillDate, setPauseTillDate] = useState("");
  const [showRetentionMessage, setShowRetentionMessage] = useState(false);
  const [showCancellationMsg, setShowCancellationMsg] = useState(false);
  const [confirmCancellationMsg, setConfirmCancellationMsg] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      const request = await axios.post("/get_subscription", {
        customer: appCtx.user.id,
      });

      console.log("Subscription product - ", request.data.data[0]);

      const prod_request = await axios.post("/get_product", {
        productId: appCtx.selectedProduct.prod,
      });

      //   console.log("Product info - ", prod_request.data);

      setProductName(prod_request.data.name);

      if (request.data.data[0].status === "active") {
        setSubscriptionIsActive(true);

        if (
          request.data.data[0].latest_invoice.lines.data[0].price.recurring
            .usage_type !== "metered"
        ) {
          setSubscriptionAmount(
            "£" +
              +request.data.data[0].latest_invoice.lines.data[0].amount / 100
          );
        } else {
          setSubscriptionAmount("Amount will be calculated based on the usage");
        }

        setSubscriptionId(request.data.data[0].id);
      }

      if (request.data.data[0].pause_collection.behavior === "void") {
        setDisablePause(true);
        setShowPauseMsg(true);
      }
    };

    fetchSubscription();
  }, []);

  const handleSubscriptionPause = (event) => {
    event.preventDefault();
    setShowRetentionMessage(false);
    setShowPauseSection(true);
  };

  const handleSubmitPause = async (event) => {
    event.preventDefault();
    const [year, month, day] = document
      .getElementById("pause_date")
      .value.split("-");
    const monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const pause_till_date = `${monthArr[+month - 1]} ${day}, ${year}`;
    setPauseTillDate(pauseTillDate);

    const request = await axios.post("/pause_subscription", {
      dateObject: { day, month, year },
      customer: appCtx.user.id,
      subscriptionId: subscriptionId,
    });

    if (request.data.pause_collection.behavior === "void") {
      setShowPauseSection(false);
      setDisablePause(true);
      setShowPauseMsg(true);
    }
  };

  const handleCancelClick = async () => {
    const request = await axios.post("/cancel_check", {
      customer: appCtx.user.id,
    });

    setShowPauseSection(false);
    console.log("Customer data -", request.data);

    if (!request.data.metadata.discount_availed) {
      setShowRetentionMessage(true);
    }

    if (request.data.metadata.discount_availed) {
      setShowCancellationMsg(true);
    }
  };

  const handleConfirmDiscount = async () => {
    const request = await axios.post("/confirm_discount", {
      subscriptionId: subscriptionId,
      priceId: appCtx.selectedProduct.price,
    });

    console.log(request.data);
  };

  const handleConfirmCancel = async () => {
    const request = await axios.post("/confirm_cancel", {
      subscriptionId: subscriptionId,
    });

    console.log(request.data);
    if (request.data.cancel_at_period_end) {
      setConfirmCancellationMsg(true);
      setShowCancellationMsg(false);
    }
  };

  return (
    <>
      <Header />
      <div className={classes.userContainer}>
        <div className={classes.userSection}>
          <div className={classes.userHeading}>
            Welcome, <span>{appCtx.user.name}</span>
          </div>

          {subscriptionIsActive && (
            <>
              <div className={classes.activeSubcription}>
                The following subscription is active for you
              </div>
              <div className={classes.productName}>
                <u>Product</u>: <span>{productName}</span>
              </div>
              <div className={classes.amountPaid}>
                <u>Amount paid per month</u>: <span>{subscriptionAmount}</span>
              </div>

              <div className={classes.btnGroup}>
                <button
                  className={`${classes.updateSubscription} ${
                    disablePause && classes.disableBtn
                  }`}
                  onClick={handleSubscriptionPause}
                  disabled={disablePause}
                >
                  Pause Subscription
                </button>
                <button
                  className={classes.updateSubscription}
                  onClick={handleCancelClick}
                >
                  Cancel Subscription
                </button>
              </div>

              {showPauseSection && (
                <div className={classes.pauseSection}>
                  <p>
                    Select the date when which you want to pause your
                    subscription
                  </p>
                  <form onSubmit={handleSubmitPause}>
                    <input type="date" id="pause_date" />
                    <button>Confirm Pause</button>
                  </form>
                </div>
              )}

              {showPauseMsg && (
                <p className={classes.pauseMsg}>
                  Your subscription is paused
                  {pauseTillDate === "" ? "." : " " + pauseTillDate}
                </p>
              )}

              {showRetentionMessage && (
                <>
                  <p className={classes.retentionMsgTxt}>
                    We are sorry to see you go. But before you go, we would
                    really like one last chance. Would you like to avail a 50%
                    discount on your subscription for 3 months?
                  </p>
                  <button
                    className={classes.confirmDiscount}
                    onClick={handleConfirmDiscount}
                  >
                    Confirm Discount
                  </button>
                </>
              )}

              {showCancellationMsg && (
                <>
                  <p className={classes.retentionMsgTxt}>
                    Are you sure you want to leave us?
                  </p>
                  <button
                    className={classes.confirmCancellation}
                    onClick={handleConfirmCancel}
                  >
                    Confirm Cancel
                  </button>
                </>
              )}

              {confirmCancellationMsg && (
                <p className={classes.retentionMsgTxt}>
                  Your subscription has been cancelled. You can continue to
                  avail the service till the end of your current subscribtion
                  period.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default User;
