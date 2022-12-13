import React from "react";
import { MdAddCircleOutline } from "react-icons/md";

const AddButton = () => {
  return (
    <button
      className="btn btn-primary d-flex align-items-center"
      style={{ gap: 4 }}
    >
      Add
      <MdAddCircleOutline size={24} />
    </button>
  );
};

export default AddButton;
