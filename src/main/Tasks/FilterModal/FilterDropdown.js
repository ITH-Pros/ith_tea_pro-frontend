import React, { useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

function FilterDropdown(props) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const handleFilterSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
  };

  const handleDateRangeChange = (event, picker) => {
    setDateRange({
      fromDate: picker.startDate.toDate(),
      toDate: picker.endDate.toDate(),
    });
    props.onFilterSelect(picker.startDate.toDate(), picker.endDate.toDate());
  };

  const renderDateRangePicker = () => {
    return (
      <DateRangePicker
        onApply={handleDateRangeChange}
        startDate={dateRange.fromDate}
        endDate={dateRange.toDate}
        maxDate={new Date()}
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
    );
  };

  const renderFilterDropdown = () => {
    let fromDate = new Date();
    let toDate = new Date();
    if (selectedFilter === "Tomorrow") {
      toDate.setDate(toDate.getDate() + 1);
      fromDate = toDate;
    } else if (selectedFilter === "Next 7 days") {
      toDate.setDate(toDate.getDate() + 7);
    } else if (selectedFilter === "Next 30 days") {
      toDate.setDate(toDate.getDate() + 30);
    }
    props.onFilterSelect(fromDate, toDate);
  };

  return (
    <div>
      <label htmlFor="filter-dropdown">Due Date:</label>
      <select
        id="filter-dropdown"
        value={selectedFilter}
        onChange={handleFilterSelect}
      >
        <option value="">Select Due Date</option>
        <option value="Today">Today</option>
        <option value="Tomorrow">Tomorrow</option>
        <option value="Next 7 days">Next 7 days</option>
        <option value="Next 30 days">Next 30 days</option>
        <option value="range">Range</option>
      </select>
      {selectedFilter === "range" && renderDateRangePicker()}
      {selectedFilter !== "range" &&
        selectedFilter !== "" &&
        renderFilterDropdown()}
    </div>
  );
}

export default FilterDropdown;
