import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetRecommendationsQuery } from "../redux/api/productApiSlice";
import Header from "../components/Header";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Product from "./Products/Product";
import { useSelector } from "react-redux";
const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  console.log(id);
  const { data, isLoading, isError } = useGetRecommendationsQuery(id);
  return (
    <>
      <Header /> 
      {userInfo && data && (
      <>
        {isLoading ? (
          <Loader />
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
                {data.map((product) => (
                  <div key={product.id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </>
      )}
    </>
  );
};

export default Home;
