import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductAttributesQuery,
} from "../../redux/api/productApiSlice";
import { useGetProductTypesQuery } from "../../redux/api/productTypesApiSlice";
import { useGetBrandsQuery } from "../../redux/api/brandsApiSlice";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firabse";
import AdminMenu from "./AdminMenu";
const UpdateProduct = () => {
  const params = useParams();
  const {
    data: productData,
    refetch,
    isLoading,
  } = useGetProductByIdQuery(params.id);
  const [image, setImage] = useState(productData?.photo || "");
  const [name, setName] = useState(productData?.name || "");
  const [modalVisable, setModalVisable] = useState("");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const { data: attributes } = useGetProductAttributesQuery(productData?.id);
  const [category, setCategory] = useState(productData?.category || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [reff, setRef] = useState(false);
  const navigate = useNavigate();
  const { data: categories = [] } = useGetProductTypesQuery();
  const { data: brands } = useGetBrandsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updatedProductId, setUpdatedProductId] = useState("");
  const [updateAttributeVisible, setUpdateAttributeVisible] = useState("");
  const handleDelete = async () => {
    try {
      if (updatedProductId) {
        let answer = window.confirm(
          "Are you sure that you want to delete this product?"
        );
        if (!answer) return;
        const result = await deleteProduct(productData.id).unwrap();
        toast.success(result);
        navigate("/admin/allproductslist");
        setRef(!reff);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  const uploadFileHandler = (path) => {
    const imageRef = ref(storage, `products/${path.name + v4()}`);
    uploadBytes(imageRef, path).then(() => {
      getDownloadURL(imageRef).then(async (res) => {
        setImage(res);
      });
    });
  };
  const handleUpdate = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !quantity ||
      !image
    ) {
      toast.error("Enter all fields");
      return;
    } else {
      try {
        const result = await updateProduct({
          productId: updatedProductId,
          formData: {
            name,
            description,
            price,
            brand_id: brand,
            type_id: category,
            created_at: new Date(),
            photo: image,
            quantity,
          },
        }).unwrap();
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(`${result.name} is updated`);
          refetch();
          setRef(!reff);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error");
      }
    }
  };
  useEffect(() => {
    if (productData && productData.id) {
      setUpdatedProductId(productData.id);
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.type_id);
      setBrand(productData.brand_id);
      setQuantity(productData.quantity);
      setImage(productData.photo);
    }
  }, [productData, reff]);
  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-3 text-lg font-bold">Update Product</div>
          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="border bg-red text-pink-800 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => uploadFileHandler(e.target.files[0])}
              />
            </label>
          </div>
          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two ml-4">
                <label htmlFor="name block">Price</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Quantity</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two ml-4">
                <label htmlFor="name block">Brand</label>
                <br />
                <select
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={isLoading || !brands}
                >
                  <option value="" disabled>
                    {isLoading ? "Loading brands..." : "Select Brand"}
                  </option>
                  {!isLoading &&
                    brands?.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Brand</label>
                <br />
                <select
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading || !categories}
                >
                  <option value="" disabled>
                    {isLoading ? "Loading categories..." : "Select categorie"}
                  </option>
                  {!isLoading &&
                    categories?.map((categorie) => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="two ml-4  justify-between">
                <label htmlFor="name block"></label>
                <br />
                <button
                  className="p-4 mb-3 w-[8rem] border rounded-lg bg-[#101011] text-white"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  className="p-4 mb-3 w-[8rem] border rounded-lg bg-[#101011] text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
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
                    <p className="text-sm text-gray-600">Value: {attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
