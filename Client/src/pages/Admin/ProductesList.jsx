import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import {
  useGetRatingsQuery,
  useCreateRatingMutation,
} from "../../redux/api/ratingesApiSlice";
import { useGetProductTypesQuery } from "../../redux/api/productTypesApiSlice";
import { useGetBrandsQuery } from "../../redux/api/brandsApiSlice";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firabse";
import { ProductAttributeForm } from "../../components/ProductAttributeForm";
import AdminMenu from "./AdminMenu";
const ProductesList = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetProductTypesQuery();
  const { data: brands } = useGetBrandsQuery();
  const [imageUrl, setImageUrl] = useState("");
  const { data: productTypes, isLoading } = useGetProductTypesQuery();
  const [addAttributVisible, setAddAttributeVisible] = useState(false);
  const [addedProductId, setAddedProductId] = useState("");
  const [modalVisable, setModalVisable] = useState("");
  const clickHandler = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !quantity ||
      !imageUrl
    ) {
      toast.error("Enter all fields");
      return;
    } else {
      try {
        const result = await createProduct({
          name,
          description,
          price,
          brand_id: brand,
          type_id: category,
          created_at: new Date(),
          photo: imageUrl,
          quantity,
        }).unwrap();
        if (result.error) {
          toast.error(result.error);
        } else {
          setAddedProductId(result.id);
          setAddAttributeVisible(true);
          toast.success(
            `${result.name} is created, now you can add attributes to it`
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Error");
      }
    }
  };
  const uploadFileHandler = (path) => {
    const imageRef = ref(storage, `products/${path.name + v4()}`);
    uploadBytes(imageRef, path).then(() => {
      getDownloadURL(imageRef).then(async (res) => {
        setPhoto(path);
        setImageUrl(res);
      });
    });
  };
  const attributeHandler = () => {
    setModalVisable(true);
  };
  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu/>
        <div className="md:w-3/4 p-3">
          <div className="h-1">Create Product</div>
          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="border bg-black text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {photo ? photo.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => uploadFileHandler(e.target.files[0])}
                className={!photo ? "hidden" : "text-black"}
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
                  onClick={clickHandler}
                >
                  Submit
                </button>
                {addAttributVisible && (
                  <button
                    className="pl-5 p-4 mb-3 w-[12rem] border rounded-lg bg-[#101011] text-white"
                    onClick={attributeHandler}
                  >
                    Add attributes
                  </button>
                )}
              </div>
              <Modal
                isOpen={modalVisable}
                onClose={() => setModalVisable(false)}
              >
                <ProductAttributeForm
                  productID={addedProductId}
                  typeId={category}
                  visible={modalVisable}
                  setVisible={setModalVisable}
                ></ProductAttributeForm>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductesList;
