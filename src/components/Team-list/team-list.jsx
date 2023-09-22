import React, { useEffect, useState } from "react";
import { fetchTeamList } from "@services/user/api";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaUser } from "react-icons/fa";
import "./team-list.css";
import UserIcon from "../ProfileImage/profileImage";
import { useQuery } from "react-query";
import { Spinner } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import UserIcon from "../Projects/ProjectCard/profileImage";

export default function ViewTeamList(props) {
  const { isTeamList, getTeamListForLogginUser } = props;
  // const [teamList, setTeamList] = useState([]);

  const { data: teamList, isLoading } = useQuery("teamList", fetchTeamList, {
    refetchOnWindowFocus: false,
    enabled: isTeamList,
    select: (data) => data?.data?.users,
  });

  return (
    <Offcanvas
      className="Offcanvas-modal"
      style={{ width: "500px" }}
      onHide={getTeamListForLogginUser}
      show={isTeamList}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Team List</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* <div className="spinner-container">
       {isLoading && <Spinner className="text-center" animation="border" variant="primary" />}
       </div>  */}
        <div className="container">
          <ul className="team-list">
            {isLoading && (
              Array.from({ length: 5 }).map((_, index) => (
              <SkeletonTheme color="white" highlightColor="#ccc">
              
              <li className="team-item">
                <div className="profile-image">
                  <Skeleton circle={true} height={30} width={30} />
                </div>
                <div className="team-details">
                  <h3>
                    <Skeleton width={150} />
                  </h3>
                </div>
              </li>
              </SkeletonTheme>
              ))
            )}

            {teamList?.map((team, index) => (
              <li key={team?.id} className="team-item">
                {team?.profilePicture ? (
                  <img
                    src={team?.profilePicture}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="icon profile-image">
                    <UserIcon key={index} firstName={team?.name} />
                  </div>
                )}
                <div className="team-details">
                  <h3>{team?.name}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
