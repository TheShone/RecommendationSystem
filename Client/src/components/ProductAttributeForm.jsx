import { useState, useEffect } from "react";
import { useGetAttributesPerTypeQuery } from "../redux/api/attributesApiSlice";
import { useCreateProductAttributeMutation } from "../redux/api/productApiSlice";
import { toast } from "react-toastify";

export const ProductAttributeForm = ({
  productID,
  typeId,
  visible,
  setVisible,
}) => {
  const [value, setValue] = useState("");
  console.log("TIP" + typeId);
  const { data: attributes, isLoading } = useGetAttributesPerTypeQuery({
    id: typeId,
  });
  const [createAttribute] = useCreateProductAttributeMutation();
  const [id, setId] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || !id || !productID) {
      toast.error("Enter all fields");
      return;
    } else {
      try {
        const result = await createAttribute({
          product_id: productID,
          attribute_id: id,
          value,
        }).unwrap();
        if (result.error) {
          toast.error(result.error);
        } else {
          setVisible(!visible);
          toast.success(`Attribute added`);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error");
      }
    }
  };
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Attribute name"
          className="py-3 px-4 border rounded-lg w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <select
          className="py-3 px-4 border rounded-lg w-full"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={isLoading || !attributes}
        >
          <option value="" disabled>
            {isLoading ? "Loading attributes..." : "Select Attribute"}
          </option>
          {!isLoading &&
            attributes?.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.attributename}
              </option>
            ))}
        </select>
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
