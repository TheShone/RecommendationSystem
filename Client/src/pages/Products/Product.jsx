import React from "react";
import { Link } from "react-router-dom";
const Product = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative">
      <div className="relative">
        <img
          src={product.photo}
          alt={product.name}
          className="w-[30rem] rounded max-h-[300px] object-contain"
        />
      </div>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              {product.price}€
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
