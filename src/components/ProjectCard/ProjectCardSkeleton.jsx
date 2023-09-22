import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./projectCard.css";
const ProjectCardSkeleton = () => {
  return (
    <SkeletonTheme color="#f3f3f3" highlightColor="#ecebeb">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="project-card">
          <div className="menu-icon">{/* Render your menu icon here */}</div>
          <div className="project-details">
            <h4>
              <Skeleton width={150} />
            </h4>
            <p>
              <Skeleton count={3} />
            </p>
          </div>

          <div className="project-stats row">
            <div className="stat col-3">
              <Skeleton width={35} height={35} />
            </div>
            <div className="stat col-3 px-0">
              <Skeleton width={35} height={35} />
            </div>
            <div className="stat col-3">
              <Skeleton width={35} height={35} />
            </div>
            <div className="stat col-3">
              <Skeleton width={35} height={35} />
            </div>
          </div>

          <div className="pull-left w-100">
            <label className="lableName">Team Members</label>
            <div className="user-profile-pics" style={{ paddingLeft: "10px" }}>
              <Skeleton  circle={true} height={30} width={30} />
              <Skeleton circle={true} height={30} width={30} />
              <Skeleton circle={true} height={30} width={30} />
              <Skeleton circle={true} height={30} width={30} />
            </div>
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
};

export default ProjectCardSkeleton;
