import React from "react";

const AppContext = React.createContext({
  user: {
    name: "",
    email: "",
    id: "",
  },
  selectedProduct: {
    prod: "",
    price: "",
  },
  setUser: (user) => {},
  setSelectedProduct: (product) => {},
  paymentMethod: "",
  setPaymentMethod: (pm) => {},
});

export default AppContext;
