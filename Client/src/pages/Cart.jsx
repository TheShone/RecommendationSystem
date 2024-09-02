import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const  addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };
  const removeFromCartHandler = (id) =>{
    dispatch(removeFromCart(id));
  }
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  }
  const { cartItems } = cart;
  return (
    <>
      <div className="cantainer flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop">Go Back</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
              {cartItems.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center mb-[1rem] pb-2 border rounded-lg shadow-sm w-[40%]"
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={product.photo}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                    <div className="mt-2">{product.brand}</div>
                    <div className="mt-2">{product.price}€</div>
                  </div>
                  <div className="w-20 pr-[1rem]">
                    <select
                      name=""
                      id=""
                      className="w-full p-1 border rounded "
                      value={product.qty}
                      onChange={(e) =>
                        addToCartHandler(product, Number(e.target.value))
                      }
                    >
                      {[...Array(product.quantity).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      className="text-red-500 mr-[2rem]"
                      onClick={() => removeFromCartHandler(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                  <div className="text-2xl font-bold">
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                    €
                  </div>
                  <button
                    className="bg-red-500 mt-4 py-2 px-4 rounded-full text-lg w-full text-white"
                    disabled={cartItems.length == 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
