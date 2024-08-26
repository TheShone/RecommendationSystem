import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
} from "../../redux/api/brandsApiSlice";
import BrandForm from "../../components/NameForm";
import Modal from "../../components/Modal";
const BrandsList = () => {
  const { data: brands, refetch } = useGetBrandsQuery();
  const [name, setName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModelVisible] = useState(false);
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [ref, setRef] = useState(false);
  useEffect(() => {
    refetch();
  }, [refetch, ref]);
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Brand name is required");
      return;
    }
    try {
      const result = await createBrand({ name }).unwrap();
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
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Name is required");
      return;
    }
    try {
      console.log(selectedBrand.id + " " + updatingName);
      const result = await updateBrand({
        id: selectedBrand.id,
        data: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedBrand(null);
        setUpdatingName("");
        setModelVisible(false);
        setRef(!ref);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteBrand = async () => {
    try {
      const result = await deleteBrand({
        id: selectedBrand.id,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Successfully deleted`);
        setSelectedBrand(null);
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
        <div className="h-12">Manage Brands</div>
        <BrandForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateBrand}
          placeholder="Enter brand name"
        />
        <br />
        <hr />
        <div className="flex wrap">
          {brands?.map((brand) => (
            <div key={brand.id}>
              <button
                className="bg-black border-black text-white py-2 px-4 rounded-lg m-3 hover:bg-red-500"
                onClick={() => {
                  {
                    setModelVisible(true);
                    setSelectedBrand(brand);
                    setUpdatingName(brand.name);
                  }
                }}
              >
                {brand.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModelVisible(false)}>
          <BrandForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateBrand}
            buttonText="Update"
            handleDelete={handleDeleteBrand}
          ></BrandForm>
        </Modal>
      </div>
    </div>
  );
};

export default BrandsList;
