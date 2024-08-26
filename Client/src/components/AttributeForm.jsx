import React from "react";
import { useGetProductTypesQuery } from "../redux/api/productTypesApiSlice";

const AttributeForm = ({
  name,
  setName,
  id,
  setId,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  const { data: productTypes, isLoading } = useGetProductTypesQuery();

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Attribute name"
          className="py-3 px-4 border rounded-lg w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="py-3 px-4 border rounded-lg w-full"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={isLoading || !productTypes}  
        >
          <option value="" disabled>
            {isLoading ? "Loading types..." : "Select Type"}
          </option>
          {!isLoading && productTypes?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-500">
            {buttonText}
          </button>
          {handleDelete && (
            <button
              onClick={handleDelete}
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AttributeForm;