import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import { useGetProductTypesQuery } from "../redux/api/productTypesApiSlice";
import { useGetBrandsQuery } from "../redux/api/brandsApiSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const productTypesQuery = useGetProductTypesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const filterproductsQuery = useFilteredProductsQuery({ checked, radio });
  useEffect(() => {
    if (!productTypesQuery.isLoading) {
      dispatch(setCategories(productTypesQuery.data));
    }
  }, [productTypesQuery.data, dispatch]);
  useEffect(() => {
    if (!checked?.length || !radio?.length) {
      if (!filterproductsQuery.isLoading) {
        const filteredProducts = filterproductsQuery.data?.filter((product) => {
          const price = parseFloat(product.price);
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;

          return price >= min && price <= max;
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filterproductsQuery.data,
    dispatch,
    priceFilter,
    minPrice,
    maxPrice,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filterproductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };
  const handleCheck = (value, id) => {
    const uploadChecked = value
      ? [...checked, id]
      : checked.filter((c) => c != id);
    dispatch(setChecked(uploadChecked));
  };
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filterproductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand != undefined)
      )
    ),
  ];
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c.id} className="mb-2">
                  <div className="flex ietms-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c.id)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-enter mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filer by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Min Price"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="w-full px-3 py-2 mb-4 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
              <input
                type="text"
                placeholder="Max Price"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full my-4 bg-black text-white rounded"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products?.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
