import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronDown,
} from "react-icons/bs";
import { getTeamWork } from "@services/user/api";
// import { useAuth } from "../../auth/AuthProvider";
import Loader from "../Shared/Loader";
import { useAuth } from "../../utlis/AuthProvider";
import { useQuery } from "react-query";

const CustomCalendar = (props) => {
  const { setTeamWorkList, isChange, setIsLoading, setIsFetching, isRefetch } =
    props;
  const [currentView, setCurrentView] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentUTCDate, setCurrentDateUTC] = useState(new Date());
  const { userDetails } = useAuth();

  const weekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + 1
  );
  const weekEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (7 - currentDate.getDay())
  );

  const fetchTeamWork = async () => {
    let dataToSend = {};

    if (currentView === "Week") {
      dataToSend = {
        fromDate: convertToUTCDayCalendar(weekStart),
        toDate: convertToUTCNightCalendar(weekEnd),
      };
    } else if (currentView === "Day") {
      dataToSend = {
        fromDate: convertToUTCForDayCalendar(currentDate),
        toDate: convertToUTCForNightCalendar(currentDate),
      };
    }

    const res = await getTeamWork(dataToSend);
    if (res.error) {
      throw new Error(res.error);
    }
    return res?.data;
  };

  const { data, error, isLoading, refetch, isFetching } = useQuery(
    ["teamWork", currentDate, currentView, isChange, isRefetch],
    fetchTeamWork,
    {
      enabled: userDetails?.role !== "CONTRIBUTOR" || isChange !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTeamWorkList(data);
      },
    }
  );

  const handlePrev = () => {
    if (currentView === "Week") {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      setCurrentDate(newDate);
    } else if (currentView === "Day") {
      console.log("currentDate", currentDate);
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1
      );
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (currentView === "Week") {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 7
      );
      setCurrentDate(newDate);
    } else if (currentView === "Day") {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
      setCurrentDate(newDate);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    const currentDateMinusOneDay = new Date(currentDate);
    currentDateMinusOneDay.setDate(currentDateMinusOneDay.getDate() - 1);
    setCurrentDateUTC(currentDateMinusOneDay.toDateString());
  }, [currentDate, currentView]);

  useEffect(() => {
    if (userDetails?.role !== "CONTRIBUTOR" && isChange !== undefined) {
      refetch();
    }
  }, [isChange]);

  useEffect(() => {
    isLoading ? setIsLoading(true) : setIsLoading(false);
    isFetching ? setIsFetching(true) : setIsFetching(false);
  }, [isLoading, isFetching]);

  return (
    <>
      <Row id="agenda" className="align-items-center">
        <Col lg={4} className="px-0">
          <Button
            variant="light"
            size="sm"
            className="left-btn"
            onClick={handlePrev}
          >
            <BsChevronDoubleLeft /> Prev {currentView}
          </Button>
          <Button
            variant="light"
            size="sm"
            className="right-btn"
            onClick={handleNext}
          >
            Next {currentView} <BsChevronDoubleRight />
          </Button>
        </Col>
        <Col lg={4} className="text-center">
          <h4>
            {currentView === "Week" ? (
              <>
                {" "}
                <span> Week of </span> <br /> {weekStart.toLocaleDateString()} -{" "}
                {weekEnd.toLocaleDateString()}
              </>
            ) : (
              currentDate?.toLocaleDateString()
            )}
          </h4>
        </Col>
        <Col lg={4} className="text-end px-0">
          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic">
              {currentView} <BsChevronDown />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewChange("Week")}>
                Week
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleViewChange("Day")}>
                Day
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </>
  );
};

export default CustomCalendar;
