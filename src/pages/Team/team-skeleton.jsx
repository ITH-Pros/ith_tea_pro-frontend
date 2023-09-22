
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "./teams.css";


const UserSkeleton = () => {
    return (
      <div className="box">
        <div className="top-bar">
          {/* <Skeleton height={10} width={50} /> */}
        </div>
        <div className="top">
          {/* <Skeleton circle={true} height={50} width={50} /> */}
        </div>
        <div className="content">
          <Skeleton circle={true} height={45} width={45} />
          <div className="content-height">
            <strong style={{ fontSize: "14px", color: "#673AB7" }}>
              <Skeleton width={100} />
            </strong>
            <p>
              <Skeleton width={150} />
            </p>
            <p>
              <Skeleton width={150} />
            </p>
            <p>
              <Skeleton width={100} />
            </p>
          </div>
        </div>
        <div className="btn">
          <Skeleton width={100} />
        </div>
      </div>
    );
  };

export default UserSkeleton;
  