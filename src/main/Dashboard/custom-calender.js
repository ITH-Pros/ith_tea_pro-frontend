import React, { useEffect, useState } from "react";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import { BsChevronDoubleLeft, BsChevronDoubleRight , BsChevronDown } from "react-icons/bs";
import { getTeamWork } from "../../services/user/api";
import { useAuth } from "../../auth/AuthProvider";

const CustomCalendar = (props) => {
  const [currentView, setCurrentView] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentUTCDate, setCurrentDateUTC] = useState(new Date());
  const { userDetails } = useAuth();
  const { setTeamWorkList , isChange} = props;

  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0,0,0,0))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    // console.log("==========", localTimeString)
    return localTimeString
  }
  
  function convertToUTCNight(dateString) {
    // console.log(dateString,'------------------')
    let utcTime = new Date(dateString);
    
    utcTime = new Date(utcTime.setUTCHours(23,59,59,999))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes*60*1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    // console.log("==========", localTimeString)
    return localTimeString
  }
  useEffect(() => {
    const currentDateMinusOneDay = new Date(currentDate);
    currentDateMinusOneDay.setDate(currentDateMinusOneDay.getDate() - 1);
    setCurrentDateUTC( currentDateMinusOneDay.toLocaleDateString());
    
    }, [currentDate ]);
  
  useEffect(() => {

    if (userDetails?.role !== "CONTRIBUTOR" ) {
        getTeamWorkList();
      }
    }, [currentDate,currentView ]);

    useEffect(() => {

        if (userDetails?.role !== "CONTRIBUTOR" && isChange !== undefined )  {
            // console.log(isChange);
            getTeamWorkList();
          }
        }, [isChange]);


  const getTeamWorkList = async () => {

    let dataToSend = { };

    if (currentView === "Week") {
      dataToSend = {
        fromDate: convertToUTCDay(weekStart),
        toDate: convertToUTCNight(weekEnd),
      };
    } else if (currentView === "Day") {
        dataToSend = {
          fromDate: convertToUTCDay(currentDate),
          toDate: convertToUTCNight(currentDate),
        };
    }
    // console.log("dataToSend", dataToSend);
    try {
      const res = await getTeamWork(dataToSend);
      if (res.error) {
        // console.log("Error while getting team work list");

      } else {
        setTeamWorkList(res?.data);
      }
    } catch (error) {
      return error.message;
    }
  };

  const handlePrev = () => {
    if (currentView === "Week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
      setCurrentDate(newDate);
      // console.log(`Previous week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "Day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
      setCurrentDate(newDate);
      // console.log(`Previous day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleNext = () => {
    if (currentView === "Week") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
      setCurrentDate(newDate);
      // console.log(`Next week clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    } else if (currentView === "Day") {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      setCurrentDate(newDate);
      // console.log(`Next day clicked: currentView=${currentView}, currentDate=${newDate.toLocaleDateString()}`);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // console.log(`View changed: currentView=${view}, currentDate=${currentDate.toLocaleDateString()}`);
  };

  const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
  const weekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay()));

  // console.log(`Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`)

  return (
    <Row id="agenda" className="align-items-center" >
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
            :currentUTCDate}
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
