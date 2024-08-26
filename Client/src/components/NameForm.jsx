import React from "react";

const ProductTypeForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  placeholder,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder={placeholder}
          className="py-3 px-4 border rounded-lg w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-500">
            {buttonText}
          </button>
          {handleDelete && (
            <button
              onClick={handleDelete}
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

export default ProductTypeForm;
