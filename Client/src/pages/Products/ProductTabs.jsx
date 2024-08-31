import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
  reviews,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  console.log(reviews);
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab == 1 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab == 2 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
      </section>
      <section>
        {activeTab == 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label htmlFor="rating" className="block text-l mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-block"
                  >
                    <option value="">Select</option>
                    <option value="1">Fail</option>
                    <option value="2">Close fail</option>
                    <option value="3">Improvement needed </option>
                    <option value="4">Very good</option>
                    <option value="5">Excellent</option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    name=""
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-black"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login">sign in</Link> to write review
              </p>
            )}
          </div>
        )}
      </section>
      <section>
        {activeTab == 2 && (
          <>
            <div>{reviews.length == 0 && <p>No Reviews</p>}</div>
            <div>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 shadow-sm xl:ml-[2rem] sm:ml-[0rem] xxl:w-[50rem] sm:w-[24rem] mb-5"
                >
                  <p className="text-l">User: {review.username} <Ratings value={review.rating} /></p>
                  <p className="text-l"></p>
                  <p className="text-l">{review.review}</p>
                  
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
