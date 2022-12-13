import React from "react";
import Card from "../../components/Card";
import { MdAddCircleOutline } from "react-icons/md";
import AddButton from "components/Buttons/Add";
import Filter from "components/Buttons/FIlter";
import ClearFilter from "components/Buttons/ClearFilter";

const Projects = () => {
  return (
    <div>
      <div className="text-end m-3   d-flex align-items-center justify-content-between">
        <div className="d-flex " style={{ gap: 16 }}>
          <Filter />
          <ClearFilter />
        </div>
        <AddButton />
      </div>
      <div className="m-5 d-flex flex-wrap" style={{ gap: 16 }}>
        {Array(8)
          .fill(0)
          .map((e, index) => {
            return (
              <div className="">
                <Card
                  name={`Project ${index + 1}`}
                  description={`Description ${index + 1}`}
                />
              </div>
            );
          })}
        <div className="">
          <div
            className="card"
            style={{
              width: "18rem",
              borderTop: "3px solid black",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              height: "100%",
            }}
          >
            <div className="card-body d-flex justify-content-center align-items-center flex-column">
              <MdAddCircleOutline size={52} />
              <h3>Add</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
