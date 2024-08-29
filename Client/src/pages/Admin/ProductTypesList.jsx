import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
  useGetProductTypesQuery,
} from "../../redux/api/productTypesApiSlice";
import ProductTypeForm from "../../components/NameForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
const ProductTypesList = () => {
  const { data: productTypes, refetch } = useGetProductTypesQuery();
  const [name, setName] = useState("");
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModelVisible] = useState(false);
  const [createProductType] = useCreateProductTypeMutation();
  const [updateProductType] = useUpdateProductTypeMutation();
  const [deleteProductType] = useDeleteProductTypeMutation();
  const [ref, setRef] = useState(false);
  useEffect(() => {
    refetch();
  }, [refetch, ref]);
  const handleCreateProductType = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Product Type name is required");
      return;
    }
    try {
      const result = await createProductType({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created`);
        setRef(!ref);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  const handleUpdateProductType = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Name is required");
      return;
    }
    try {
      console.log(selectedProductType.id + " " + updatingName);
      const result = await updateProductType({
        id: selectedProductType.id,
        data: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedProductType(null);
        setUpdatingName("");
        setModelVisible(false);
        setRef(!ref);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteProductType = async () => {
    try {
      const result = await deleteProductType({
        id: selectedProductType.id,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Successfully deleted`);
        setSelectedProductType(null);
        setUpdatingName("");
        setModelVisible(false);
        setRef(!ref);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
      <AdminMenu/>
        <div className="h-12">Manage Product Types</div>
        <ProductTypeForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateProductType}
          placeholder="Enter categorie name"
        />
        <br />
        <hr />
        <div className="flex wrap">
          {productTypes?.map((productType) => (
            <div key={productType.id}>
              <button
                className="bg-black border-black text-white py-2 px-4 rounded-lg m-3 hover:bg-red-500"
                onClick={() => {
                  {
                    setModelVisible(true);
                    setSelectedProductType(productType);
                    setUpdatingName(productType.name);
                  }
                }}
              >
                {productType.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModelVisible(false)}>
          <ProductTypeForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateProductType}
            buttonText="Update"
            handleDelete={handleDeleteProductType}
          ></ProductTypeForm>
        </Modal>
      </div>
    </div>
  );
};

export default ProductTypesList;
