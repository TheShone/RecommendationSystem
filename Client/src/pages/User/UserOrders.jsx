import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderSlice";
import { useSelector } from "react-redux";
const UserOrders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: orders,
    isLoading,
    error,
  } = useGetMyOrdersQuery(userInfo?.id);
  console.log(orders);
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-sembold mb-4 ml-20">My Orders</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <table className="w-4/5 ml-20">
          <thead>
            <tr>
              <td className="py-2">ID</td>
              <td className="py-2">TOTAL</td>
              <td className="py-2">SHIPPING ADDRESS</td>
              <td className="py-2">PAID && DELIVERED</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.total_price}€</td>
                <td className="py-2">{order.shipping_address}</td>

                <td className="px-2 py-2">
                  {order.status ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  <Link to={`/order/${order.id}`}>
                    <button className="bg-green-400 text-back py-2 px-3 rounded">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrders;
