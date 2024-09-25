import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div
      className="relative w-[20rem] h-[25rem] bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <section className="relative">
        <Link to={`/product/${p.id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full object-contain"
            src={p.photo}
            alt={p.name}
            style={{ height: "170px"}}
          />
        </Link>
      </section>

      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-l text-white dark:text-white">{p?.name}</h5>

          <p className="font-semibold text-red-500">{p?.price}€</p>
        </div>

        <p className="mb-3 font-normal text-[#CFCFCF]">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
          </Link>

          <button
            className="p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;