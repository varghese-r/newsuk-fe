import React, { useState } from "react";

import AppContext from "./app-context";

const AppContextProvider = (props) => {
  const [user, setUser] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");

  const setUserHandler = (user) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        name: user.name,
        email: user.email,
        id: user.id,
      };
    });
  };

  const setSelectedProductHandler = (product) => {
    setSelectedProduct((prevProd) => {
      return {
        ...prevProd,
        prod: product.prod,
        price: product.price,
      };
    });
  };

  const paymentMethodHandler = (pm) => {
    setPaymentMethod(pm);
  };

  const appCtx = {
    user: user,
    selectedProduct: selectedProduct,
    setUser: setUserHandler,
    setSelectedProduct: setSelectedProductHandler,
    paymentMethod: paymentMethod,
    setPaymentMethod: paymentMethodHandler,
  };

  return (
    <AppContext.Provider value={appCtx}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
