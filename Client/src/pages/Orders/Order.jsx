import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetOrderQuery,
  useUpdateOrderMutation,
  useCreatePurchaseMutation,
} from "../../redux/api/orderSlice";
const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderQuery(orderId);
  const { userInfo } = useSelector((state) => state.auth);
  const [updateOrder, { isLoading: loadingUpdateProfile }] =
    useUpdateOrderMutation();
  const [createPurchase, { isLoading: loadingPurchase }] =
    useCreatePurchaseMutation();

  console.log(order);
  function onError(err) {
    toast.error(err.message);
  }
  const statusHandler = async () => {
    try {
      const res = await updateOrder({
        id: order[0].id,
        status: true,
      }).unwrap();
      console.log(res);
      toast.success("Order updated successfuly");
      order[0].products.forEach((product) => {
        createPurchase({
          user_id: order[0].user_id,
          product_id: product.id,
          purchase_date: new Date(),
        });
      });
      navigate(`/admin/orders`);
    } catch (error) {
      console.log("greska" + error);
      toast.error(error);
    }
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order[0].products && order[0].products.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order[0].products &&
                    order[0].products.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                          />
                        </td>

                        <td className="p-2">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </td>

                        <td className="p-2 text-center">{item.qty}</td>
                        <td className="p-2 text-center">{item.price}€</td>
                        <td className="p-2 text-center">
                          {(item.qty * item.price).toFixed(2)}€
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order[0].shipping_address}
          </p>
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[1rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Price</span>
          <span>{order[0].total_price}€</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Status</span>
          {order[0].status ? (
            <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
              Completed
            </p>
          ) : (
            <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
              Pending
            </p>
          )}
        </div>
        {userInfo.role == "admin" && !order[0].status && (
          <div className="flex justify-between mb-2">
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
              onClick={statusHandler}
            >
              Change status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
