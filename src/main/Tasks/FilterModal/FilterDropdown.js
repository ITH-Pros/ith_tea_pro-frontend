import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import DatePicker from "react-datepicker";
import { Container, Row, Form, Modal, Col, Button } from "react-bootstrap";



function FilterDropdown(props) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [fromDate, setFromDate] = useState( new Date(localStorage.getItem('fromDate')||new Date()));
  const [toDate, setToDate] = useState( new Date(localStorage.getItem('toDate')||new Date()));

  useEffect(() => {

   if(fromDate){
    localStorage.setItem('fromDate',fromDate)
   }

  }, [fromDate]);
  useEffect(() => {
 
   if(toDate){
    localStorage.setItem('toDate',toDate)
   }
  }, [toDate]);
  useEffect(() => {
    // console.log(fromDate,'-------------------------from date')
    // console.log(toDate,'-------------------------to date')
    if(fromDate && toDate){
      props.onFilterSelect(fromDate, toDate);

    }
   if(fromDate){
    localStorage.setItem('fromDate',fromDate)
   }
   if(toDate){
    localStorage.setItem('toDate',toDate)
   }
  }, [fromDate,toDate]);

  useEffect(() => {
    const dueDate = JSON.parse(localStorage.getItem("dueDate"));
    const selectedFilter = localStorage.getItem("selectedFilterTypes");
    // console.log(selectedFilter,'selectedFilterTypes')
    if (dueDate && selectedFilter === "range") {
      // console.log(dueDate?.fromDate,'=====================')
      // setFromDate(dueDate?.fromDate?.split('T')[0]);
      // setToDate(dueDate?.toDate);
      setSelectedFilter("range");
    } else {
      setSelectedFilter(selectedFilter);
    }
  }, []);

  const handleFilterSelect = (event) => {
    localStorage.removeItem('fromDate')
    localStorage.removeItem('toDate')
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
    localStorage.setItem("selectedFilter", selectedValue);
    localStorage.setItem("filterClicked", true);
    localStorage.setItem("selectedFilterTypes", selectedValue);

  };


  const renderDatePickers = () => {
    return (
      <div className="d-flex justify-content-between">
  <Form.Group controlId="formDateUpdated">
                <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label>From</Form.Label>
                  </Col>
                  <Col sm="9">
                    <DatePicker 
                    
                      selected={fromDate||new Date()}
                      onChange={(date) =>{ setFromDate(new Date(date))}}
                      className="form-control"
                      placeholderText="From Date"
                maxDate={toDate || new Date()}
                // disabled={props.clearFilterProp && localStorage.getItem('filterClicked')}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="formDateCompleted">
                <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label>To</Form.Label>
                  </Col>
                  <Col sm="9">
                    <DatePicker
                      selected={ toDate||new Date()}
                      onChange={(date) =>{ localStorage.setItem('toDate',date); setToDate(new Date(date));}}
                      className="form-control"
                      minDate={fromDate}
                placeholderText="To Date"
                // disabled={props.clearFilterProp && localStorage.getItem('filterClicked')}

                
                    />
                  </Col>
                </Row>
              </Form.Group>
      </div>
    );
  };

  const renderFilterDropdown = () => {
    localStorage.setItem("selectedFilter", selectedFilter);
    let fromDate = new Date();
    let toDate = new Date();
    if (selectedFilter === "Today") {
      toDate = fromDate;
    } else if (selectedFilter === "Tomorrow") {
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
      <Row className="filterFields mb-0">
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
{selectedFilter === "range" ? (
  renderDatePickers()
): (
selectedFilter !== "" && renderFilterDropdown()
)}
</div>
);
}

export default FilterDropdown;