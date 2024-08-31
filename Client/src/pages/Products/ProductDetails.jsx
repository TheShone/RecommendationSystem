import React from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetProductAttributesQuery,
  useCreateReviewMutation,
  useGetReviewsQuery,
} from "../../redux/api/productApiSlice";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { IoMdArrowBack } from "react-icons/io";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const { data: attributes } = useGetProductAttributesQuery(product?.id);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetReviewsQuery(productId);
  const addToChartHandler = async () => {};
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const id = userInfo.id;
      await createReview({
        user_id: id,
        product_id: productId,
        rating,
        review: comment,
      }).unwrap();
      refetch();
      toast.success("Review createf successful");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
  return (
    <>
      <div>
        <Link
          to="/"
          className="text-black font-semibold hover:underline flex items-center ml-[10rem]"
        >
          <IoMdArrowBack className="text-black mr-2 size-8" /> 
          
        </Link>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img
                src={product.photo}
                alt={product.name}
                className="max-h-[500px] w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem] object-contain"
                object-cover
              />
            </div>
            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {product.description}
              </p>
              <p className="text-5xl my-4 fontextrabold">{product.price}€</p>
              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-black" /> Brand:
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaClock className="mr-2 text-black" />
                    {moment(product.created_at).fromNow()}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <BiCategory className="mr-2 text-black" /> Category:{" "}
                    {product.category}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-black" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Product Attributes:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {attributes?.map((attr) => (
                    <div
                      key={attr.id}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold">{attr.name}</h4>
                      <p className="text-sm text-gray-600">
                        Value: {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between flex-wrap mt-4">
                <Ratings
                  value={product.average_rating}
                  text={`${product.numreviews} reviews`}
                />
                {product.quantity > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(product.quantity).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="btn-container">
                <button
                  onClick={addToChartHandler}
                  disable={product.quantity == 0}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add to chart
                </button>
              </div>
            </div>
            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
                reviews={reviews}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
