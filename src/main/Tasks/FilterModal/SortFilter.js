import React, { useState, useEffect } from "react";

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
      <label htmlFor="sort-by">Sort by:</label>
      <select id="sort-by" value={sortBy} onChange={handleSortByChange}>
        <option value=" ">Select Sort Type</option>
        <option value="due-date">Due Date</option>
        <option value="status">Status</option>
        <option value="date-created">Date Created</option>
        <option value="date-updated">Date Updated</option>
        <option value="date-completed">Date Completed</option>
        <option value="alphabetically">Alphabetically</option>
      </select>
      <label htmlFor="sort-order">Sort order:</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={handleSortOrderChange}
      >
        <option value=" ">Select By</option>
        <option value="-1">Decreasing</option>
        <option value="1">Increasing</option>
      </select>
    </div>
  );
}

export default SortByDropdown;
