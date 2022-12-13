import React from "react";
import { AiFillStar, AiOutlineCheck } from "react-icons/ai";
import { BsFillGearFill, BsCalendarWeek, BsFolderFill } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { SiGooglechat } from "react-icons/si";

const Cards = (props: any) => {
  return (
    <div
      className="card"
      style={{
        width: "18rem",
        borderTop: "3px solid black",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-end">
          <AiFillStar />
          <BsFillGearFill />
        </div>
        <h5 className="card-title">{props.name || `Project Name`}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {props.description || "No description"}
        </h6>
        <div style={{ gap: 8, display: "flex" }} className={`my-4`}>
          <ImCheckmark size={24} />
          <SiGooglechat size={24} />
          <BsCalendarWeek size={24} />
          <BsFolderFill size={24} />
        </div>
      </div>
    </div>
  );
};

export default Cards;
