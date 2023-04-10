import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import {Row, Col } from "react-bootstrap";

function FilterDropdown(props) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    const dueDate = JSON.parse(localStorage.getItem("dueDate"));
    const selectedFilter = localStorage.getItem("selectedFilterTypes");
    console.log(selectedFilter,'selectedFilterTypes')
    if (dueDate && selectedFilter === "range") {
      setDateRange({
        fromDate: new Date(dueDate.fromDate),
        toDate: new Date(dueDate.toDate),
      });
      setSelectedFilter("range");
    } else {
      setSelectedFilter(selectedFilter);
    }
  }, []);

  const handleFilterSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
    localStorage.setItem("selectedFilter", selectedValue);
    localStorage.setItem("selectedFilterTypes", selectedValue);

  };

  const handleDateRangeChange = (event, picker) => {
    localStorage.setItem("selectedFilter", "range");
    localStorage.setItem("selectedFilterTypes", "range");

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
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
    );
  };

  const renderFilterDropdown = () => {
    let fromDate=new Date();
    let toDate =new Date();
    localStorage.setItem("selectedFilter", selectedFilter);
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
                <Row className="filterFields">

      <Col sm="3">
      <label htmlFor="filter-dropdown" style={{ fontSize: "0.9rem !important", fontWeight: "bold" }}>Due Date:</label>
      </Col>
      <Col sm="9">
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
        </Col>
       </Row>
        
     
      {selectedFilter === "range" && renderDateRangePicker()}
      {selectedFilter !== "range" &&
        selectedFilter !== "" &&
          renderFilterDropdown()}
        
    </div>
  );
}

export default FilterDropdown;
