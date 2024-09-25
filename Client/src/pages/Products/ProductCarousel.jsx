import React from "react";
import { useTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
const ProductCarousel = () => {
  const { data: products, isLoading, error } = useTopProductsQuery();
  const CustomArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{ ...style, color: "black", fontSize: "2rem" }}
      onClick={onClick}
    />
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <CustomArrow />,
    nextArrow: <CustomArrow />,
  };
  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
          prevArrow={<div className="slick-prev" style={{ color: "black" }} />}
          nextArrow={<div className="slick-next" style={{ color: "black" }} />}
        >
          {products.map(
            ({
              photo,
              id,
              name,
              price,
              description,
              brand,
              category,
              created_at,
              numreviews,
              average_rating,
              quantity,
            }) => (
              <div key={id}>
                <img
                  src={photo}
                  alt={name}
                  className="w-full rounded-lg object-contain max-h-[30rem]"
                />
                <div className="flex justufy-between w-[20rem] pl-[2rem]">
                  <div className="one">
                    <h2>{name}</h2>
                    <p>{price}€</p>
                    <br />
                    <br />
                    <p className="w-[25rem]">
                      {description.substring(0, 170)}...
                    </p>
                  </div>
                  <div className="flex justify-between w-[20rem]">
                    <div className="one">
                      <h1 className="flex items-center mb-6 w-[15rem]">
                        <FaStore className="mr-2 text-black" />
                        Brand: {brand}
                      </h1>
                      <div className="flex items-center mb-6  w-[15rem]">
                        <BiCategory className="mr-2 text-black " />
                        Category: {category}
                      </div>
                      <h1 className="flex items-center mb-6 w-[15rem]">
                        <FaClock className="mr-2 text-black" />
                        Added: {moment(created_at).fromNow()}
                      </h1>
                    </div>
                    <div className="two">
                      <div className="flex items-center mb-6  w-[7rem]">
                        <FaStar className="mr-2 text-black " />
                        Ratings: {Math.round(average_rating)}
                      </div>
                      <div className="flex items-center mb-6  w-[10rem]">
                        <FaShoppingCart className="mr-2 text-black " />
                        Quantity: {quantity}
                      </div>
                      <h1 className="flex items-center mb-6 w-[8rem]">
                        <FaStar className="mr-2 text-black" />
                        Reviews: {numreviews}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
