import { Link } from "react-router-dom";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.photo}
          alt={product.name}
          className="w-full h-[200px] object-contain rounded"
        />
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h2 className="flex justify-between items-center">
              <div>{product.name}</div>
              <span className="bg-pink-100 text-red-800 text-sm font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                {product.price}€
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SmallProduct;
