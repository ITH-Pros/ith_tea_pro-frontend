import AddButton from "components/Buttons/Add";
import ClearFilter from "components/Buttons/ClearFilter";
import Filter from "components/Buttons/FIlter";
import React from "react";

import ReactSelect from "components/ReactSelect";

const Tasks = () => {
  return (
    <div>
      <div className="text-end m-3   d-flex align-items-center justify-content-between">
        <div className="d-flex " style={{ gap: 16 }}>
          <Filter />
          <ClearFilter />
        </div>
        <div className="d-flex " style={{ gap: 16 }}>
          <AddButton />
          {/* <ReactSelect options={}/> */}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Tasks;
