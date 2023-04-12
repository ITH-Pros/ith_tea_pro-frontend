import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { BsChevronDoubleLeft, BsChevronLeft, BsChevronRight, BsChevronDoubleRight } from "react-icons/bs";

const CustomCalendar = () => {
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    if (currentView === "week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
      setCurrentDate(newDate);
      console.log(`Previous week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
      setCurrentDate(newDate);
      console.log(`Previous day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleNext = () => {
    if (currentView === "week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
      setCurrentDate(newDate);
      console.log(`Next week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      setCurrentDate(newDate);
      console.log(`Next day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setCurrentView(newView);
    console.log(`View changed: currentView=${newView}, currentDate=${currentDate.toLocaleDateString()}`);
  };

  const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
  const weekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);

  return (
    <Row id="agenda">
      <Col lg={4}>
        <Button variant="light" size="sm" className="left-btn" onClick={handlePrev}>
          <BsChevronDoubleLeft /> Prev {currentView === "week" ? "Week" : "Day"}
        </Button>
        <Button variant="light" size="sm" className="right-btn" onClick={handleNext}>
          Next {currentView === "week" ? "Week" : "Day"} <BsChevronDoubleRight />
        </Button>
      </Col>
      <Col lg={4}>
        <h4 className="text-center">{currentView === "week" ? `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}` : currentDate.toLocaleDateString()}</h4>
      </Col>
      <Col lg={4} className="text-end">
        <select value={currentView} onChange={handleViewChange}>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </Col>
    </Row>
  );
};

export default CustomCalendar;
