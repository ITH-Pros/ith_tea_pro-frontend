import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";
const Navbar = (props: any) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Dashboard <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Projects
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Tasks
            </a>
          </li>
          <li className="nav-item">
            <NavLink
              to="/ratings"
              className={(isActive) =>
                "nav-link" + (!isActive ? " unselected" : "")
              }
            >
              Ratings
            </NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#">
              Teams
            </a>
          </li>
        </ul>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#"></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
