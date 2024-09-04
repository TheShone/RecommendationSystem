import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderSlice";
import { clearCarItems } from "../../redux/features/cart/cartSlice";
const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth);
  const [createOrder, { isLoading }, error] = useCreateOrderMutation();
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);
  const orderHandler = async () => {
    try {
      const res = await createOrder({
        user_id: userInfo.userInfo.id,
        products: cart.cartItems.map((item) => ({
          name: item.name,
          image: item.photo,
          price: item.price,
          qty: item.qty,
          id: item.id,
        })),
        shipping_address:
          cart.shippingAddress.address +
          " " +
          cart.shippingAddress.city +
          " " +
          cart.shippingAddress.country +
          " " +
          cart.shippingAddress.postalCode,
        total_price: cart.totalPrice,
        status: false,
      }).unwrap();
      dispatch(clearCarItems());
      toast.success("Order created successfuly");
      navigate(`/userorders`);
    } catch (error) {
      toast.error(error);
    }
  };
  const dispatch = useDispatch();
  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8 ">
        {cart.cartItems.length == 0 ? (
          <Message>Cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-4/5 border-collapse ml-20">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top">Image</td>
                  <td className="px-1 py-2 text-left">Product</td>
                  <td className="px-1 py-2 text-left">Quantity</td>
                  <td className="px-1 py-2 text-left">Price</td>
                  <td className="px-1 py-2 text-left">Total</td>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}€</td>
                    <td className="p-2">{item.qty * item.price}€</td>
                  </tr>
                ))}
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold">Order Summery</h2>
                  <div className="flex justify-beteen flex-wrap p-8 bg-gray-500 text-white">
                    <ul className="text-lg">
                      <li>
                        <span className="font-semibold mb-4">Items: </span>
                        {cart.itemsPrice}€
                      </li>
                      <li>
                        <span className="font-semibold mb-4">Shipping: </span>
                        {cart.shippingPrice}€
                      </li>
                      <li>
                        <span className="font-semibold mb-4">Tax: </span>
                        {cart.taxPrice}€
                      </li>
                      <li>
                        <span className="font-semibold mb-4">Total: </span>
                        {cart.totalPrice}€
                      </li>
                    </ul>
                    {error && (
                      <Message varient="danger">{error.data.message}</Message>
                    )}
                    <div className="ml-20">
                      <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                      <p>
                        {cart.shippingAddress.address}{" "}
                        {cart.shippingAddress.city}{" "}
                        {cart.shippingAddress.country}{" "}
                        {cart.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </tbody>
              <div>
                <button
                  type="button"
                  className="bg-green-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
                  disabled={cart.cartItems == 0}
                  onClick={orderHandler}
                >
                  Submit Order
                </button>
                {isLoading && <Loader />}
              </div>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
