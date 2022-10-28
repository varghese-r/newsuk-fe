import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import AppContextProvider from "./contexts/AppContextProvider";
import Checkout from "./pages/Checkout/Checkout";
import User from "./pages/User/User";

function App() {
  return (
    <AppContextProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </AppContextProvider>
  );
}

export default App;
