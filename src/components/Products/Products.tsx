import React, { useState, useEffect } from "react";

import classes from "./Products.module.css";

import axios from "../../utils/axios";
import Product from "../Product/Product";

import { ProdProp } from "../Product/Product";

const Products = () => {
  const [prodArr, setProdArr] = useState<ProdProp[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const request = await axios.get("/products");
      setProdArr(request.data);
    };

    fetchProducts();
  }, []);
  return (
    <div className={classes.products}>
      {prodArr.map((prod, index) => {
        return <Product {...prod} key={index} />;
      })}
    </div>
  );
};

export default Products;
