import React, { useState } from "react";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import { BsChevronDoubleLeft, BsChevronLeft, BsChevronDown, BsChevronDoubleRight } from "react-icons/bs";
import "./dashboard.css";

const CustomCalendar = () => {
  const [currentView, setCurrentView] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    if (currentView === "Week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
      setCurrentDate(newDate);
      console.log(`Previous week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "Day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
      setCurrentDate(newDate);
      console.log(`Previous day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleNext = () => {
    if (currentView === "Week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
      setCurrentDate(newDate);
      console.log(`Next week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "Day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      setCurrentDate(newDate);
      console.log(`Next day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    console.log(`View changed: currentView=${view}, currentDate=${currentDate.toLocaleDateString()}`);
  };

  const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
  const weekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay()));

//   weekstart , weekend
console.log(`Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`)

  return (
    <Row id="agenda">
      <Col lg={4} className="px-0">
        <Button variant="light" size="sm" className="left-btn" onClick={handlePrev}>
          <BsChevronDoubleLeft /> Prev {currentView}
        </Button>
        <Button variant="light" size="sm" className="right-btn" onClick={handleNext}>
          Next {currentView} <BsChevronDoubleRight />
        </Button>
      </Col>
      <Col lg={4} className="text-center">
        <h4>
          {currentView === "Week"
            ?<> <span> Week of </span> <br/>  {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}</>
            : currentDate.toLocaleDateString()}
        </h4>
      </Col>
      <Col lg={4} className="text-end px-0">
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic">
            {currentView} <BsChevronDown/>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleViewChange("Week")}>Week</Dropdown.Item>
            <Dropdown.Item onClick={() => handleViewChange("Day")}>Day</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default CustomCalendar;
