import React, { useEffect, useState } from "react";
import { fetchTeamList } from "../../services/user/api";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaUser } from "react-icons/fa";
import "./team-list.css";
import UserIcon from "../Projects/ProjectCard/profileImage";


export default function ViewTeamList(props) {
  const { isTeamList, getTeamListForLogginUser } = props;
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    getTeamList();
  }, []);

  const getTeamList = async () => {
    try {
      const response = await fetchTeamList();
      if (response.error) {
        return;
      } else {
        setTeamList(response?.data?.users);
      }
    } catch (error) {
      return error.message;
    }
  };

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
        <div className="container">
          <ul className="team-list">
            {teamList.map((team , index) => (
              <li key={team?.id} className="team-item">
                {team?.profilePicture ? (
                  <img src={team?.profilePicture} alt="Profile" className="profile-image" />
                ) : (
                  <div className="icon profile-image">
                  <UserIcon key={index}  firstName={team?.name} />
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
