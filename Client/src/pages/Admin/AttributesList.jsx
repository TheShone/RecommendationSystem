import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributesQuery,
} from "../../redux/api/attributesApiSlice";
import { useGetProductTypesQuery } from "../../redux/api/productTypesApiSlice";
import AttributeForm from "../../components/AttributeForm";
import Modal from "../../components/Modal";
const BrandsList = () => {
  const { data: attributes, refetch } = useGetAttributesQuery();
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [modalVisible, setModelVisible] = useState(false);
  const [createAttribute] = useCreateAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [ref, setRef] = useState(false);
  useEffect(() => {
    refetch();
  }, [refetch, ref]);
  const handleCreateAttribute = async (e) => {
    e.preventDefault();
    if (!name || !typeId) {
      toast.error("Name and category is required");
      return;
    }
    try {
      const result = await createAttribute({ name, type_id: typeId }).unwrap();
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
  const handleUpdateAttribute = async (e) => {
    e.preventDefault();
    if (!updatingName && !updatingId) {
      toast.error("Name and category is required");
      return;
    }
    try {
      console.log("ID JE " + updatingId);
      const result = await updateAttribute({
        id: selectedAttribute.id,
        data: { name: updatingName, type_id: updatingId },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedAttribute(null);
        setUpdatingName("");
        setUpdatingId("");
        setModelVisible(false);
        setRef(!ref);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAttribute = async () => {
    try {
      const result = await deleteAttribute({
        id: selectedAttribute.id,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Successfully deleted`);
        setSelectedAttribute(null);
        setUpdatingId("");
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
        <div className="h-12">Manage Attributes</div>
        <AttributeForm
          name={name}
          setName={setName}
          id={typeId}
          setId={setTypeId}
          handleSubmit={handleCreateAttribute}
        />
        <br />
        <hr />
        <div className="flex wrap">
          {attributes?.map((attribute) => (
            <div key={attribute.id}>
              <button
                className="bg-black border-black text-white py-2 px-4 rounded-lg m-3 hover:bg-red-500"
                onClick={() => {
                  {
                    setModelVisible(true);
                    setSelectedAttribute(attribute);
                    setUpdatingName(attribute.attributename);
                    setUpdatingId(attribute.type_id);
                    console.log("KURCINAAAAA" + attribute.type_id);
                  }
                }}
              >
                {attribute.categorie}: {attribute.attributename}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModelVisible(false)}>
          <AttributeForm
            name={updatingName}
            setName={setUpdatingName}
            id={updatingId}
            setId={setUpdatingId}
            handleSubmit={handleUpdateAttribute}
            buttonText="Update"
            handleDelete={handleDeleteAttribute}
          ></AttributeForm>
        </Modal>
      </div>
    </div>
  );
};

export default BrandsList;
