import React, { useState, useEffect } from "react";
import { Col,Row } from "react-bootstrap";

function SortByDropdown(props) {
  const [sortBy, setSortBy] = useState(" ");
  const [sortOrder, setSortOrder] = useState(" ");

  const handleSortByChange = (event) => {
    const value = event.target.value;
    setSortBy(value);
    sendSortByToBackend(value);
  };

  useEffect(() => {
    const sortOrder = localStorage.getItem("sortOrder");
    const sortType = localStorage.getItem("sortType");
    if (sortOrder) {
      setSortOrder(sortOrder);
    }
    if (sortType) {
      setSortBy(sortType);
    }
  }, []);

  const handleSortOrderChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    sendSortOrderToBackend(value);
  };

  const sendSortByToBackend = (sortByValue) => {
    props.onFilterSortSelect(sortByValue);
  };

  const sendSortOrderToBackend = (sortOrderValue) => {
    props.onFilterSortOrderSelect(sortOrderValue);
  };

  return (
    <div>
      <Row>
        <Col sm="3">
      <label htmlFor="sort-by" style={{fontSize:"0.9rem !important",fontWeight: "bold"}}>Sort By:</label>

        </Col>
        <Col sm="9">
        <select id="sort-by" value={sortBy} onChange={handleSortByChange}  className="mb-2">
        <option value=" ">Select Sort Type</option>
        <option value="due-date">Due Date</option>
        <option value="status">Status</option>
        <option value="date-created">Date Created</option>
        <option value="date-updated">Date Updated</option>
        <option value="date-completed">Date Completed</option>
        <option value="alphabetically">Alphabetically</option>
      </select>

        </Col>
      </Row>

      <Row>
        <Col sm="3">

      <label htmlFor="sort-order" style={{fontSize:"0.9rem !important",fontWeight: "bold"}}>Sort order:</label>
        </Col>
        <Col sm="9">
        <select
        id="sort-order"
        value={sortOrder}
        onChange={handleSortOrderChange}
      >
        <option value=" ">Select By</option>
        <option value="-1">Decreasing</option>
        <option value="1">Increasing</option>
      </select>
        </Col>
      </Row>
     
   
    </div>
  );
}

export default SortByDropdown;
