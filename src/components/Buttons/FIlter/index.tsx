import React from "react";
import { FaFilter } from "react-icons/fa";

const Filter = () => {
  return (
    <button
      className="btn d-flex align-items-center"
      style={{ gap: 4, backgroundColor: "#eee" }}
    >
      Filter
      <FaFilter size={16} />
    </button>
  );
};

export default Filter;
