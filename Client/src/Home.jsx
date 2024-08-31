import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../src/redux/api/productApiSlice";
import Header from "./components/Header";
import Message from "./components/Message";
import Loader from "./components/Loader";
import Product from "./pages/Products/Product";
const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[12rem] mt-[5rem] text-[3rem]">
              Recommended Products
            </h1>
            <Link
              to="/shop"
              className="bg-red-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[5rem] text-white"
            >
              Shop
            </Link>
            </div>
            <div>
            <div className="flex justify-center flex-wrap mt-[1rem] text-black">
              {data.products.map((product) => (
                <div key={product.id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
