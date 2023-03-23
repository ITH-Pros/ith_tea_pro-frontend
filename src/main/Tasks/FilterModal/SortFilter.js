import React, { useState } from "react";

function SortByDropdown() {
  const [sortBy, setSortBy] = useState(" ");
  const [sortOrder, setSortOrder] = useState(" ");

  const handleSortByChange = (event) => {
    const value = event.target.value;
    setSortBy(value);
    sendSortByToBackend(value);
  };

  const handleSortOrderChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    sendSortOrderToBackend(value);
  };

  const sendSortByToBackend = (sortByValue) => {
    // Send the selected sortBy value to the backend in a payload
    const payload = {
      sortBy: sortByValue,
    };
      console.log(payload, "----------------------------payload");
      
    // Send the payload to the backend using whatever method you prefer (e.g. fetch(), axios, etc.)
  };

  const sendSortOrderToBackend = (sortOrderValue) => {
    // Send the selected sortOrder value to the backend in a payload
    const payload = {
      sortOrder: sortOrderValue,
    };
      console.log(payload,'----------------------------payload')
    // Send the payload to the backend using whatever method you prefer (e.g. fetch(), axios, etc.)
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
        <option value="decreasing">Decreasing</option>
        <option value="ascending">Increasing</option>
      </select>
    </div>
  );
}

export default SortByDropdown;
