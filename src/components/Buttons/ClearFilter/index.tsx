import React from "react";
import { RxCrossCircled } from "react-icons/rx";

const ClearFilter = () => {
  return (
    <button
      className="btn btn-primary d-flex align-items-center"
      style={{ gap: 4 }}
    >
      Clear filter
      <RxCrossCircled size={16} />
    </button>
  );
};

export default ClearFilter;
