import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatings, getRatingsDetailsByID } from "../../../services/user/api";
import Loader from "../../../components/Loader";
import { Accordion, Modal, Row, Col } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./weekCalender.css";

Chart.register(...registerables);

const locales = {
  "en-US": require("date-fns"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function MyCalendar() {
  const [myRatings, setMyRatings] = useState([]);
  const [myGraphRatings, setMyGraphRatings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedRatingDate, setSelectedRatingDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [ratingDetail, setRatingDetail] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [userRatingForGraph, setUserRatingForGraph] = useState([]);

  useEffect(() => {
    getAllRatings();
    getUserRatings();
  }, [selectedDate]);

  // useEffect(() => {
  //   if (selectedRatingDate) {
  //     getRatingDetail();
  //   }
  // }, [selectedRatingDate]);

  // async function getUserRatings() {
  //   setLoading(true);
  //   try {
  //     let dataToSend = {
  //       date: selectedDate.getDate(),
  //       month: selectedDate.getMonth() + 1,
  //       year: selectedDate.getFullYear(),
  //       userRating: true,
  //     };

  //     const rating = await getRatings(dataToSend);
  //     if (rating.error) {
  //       // console.log(rating?.error);
  //       setLoading(false);
  //     } else {
  //       let userRatingObj = {};
  //       rating.data?.[0]?.ratings?.forEach((element) => {
  //         userRatingObj[element.date] = element.rating;
  //       });
  //       let userRatingForGraph = [];
  //       for (let i = 1; i < daysInThisMonth(); i++) {
  //         if (!userRatingObj[i]) {
  //           userRatingObj[i] = userRatingObj[i - 1] || 5; // REMOVE IT AND HANDLE IF date 1 rating is not there
  //         }
  //         userRatingForGraph.push(userRatingObj[i]);
  //       }
  //       setUserRatingForGraph(userRatingForGraph);
  //       // console.log(userRatingForGraph, "---------------------------------Rating of User");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }

  async function getUserRatings() {
    setLoading(true);
    try {
      let dataToSend = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        userRating: true,
      };

      const rating = await getRatings(dataToSend);
      if (rating.error) {
        // console.log(rating?.error);
        setLoading(false);
      } else {
        let userRatingObj = {};
        rating.data?.[0]?.ratings?.forEach((element) => {
          userRatingObj[element.date] = element.rating;
        });
        let userRatingForGraph = [];
        const totalDays = getTotalDaysInMonth(selectedDate);
        
        for (let i = 1; i <= totalDays; i++) {
          if (!userRatingObj[i] && userRatingObj[i] !== 0) {
            userRatingObj[i] = userRatingObj[i - 1] || 0;
          }
          userRatingForGraph.push(userRatingObj[i]);
        }
        
        setUserRatingForGraph(userRatingForGraph);

        // console.log(userRatingForGraph, "---------------------------------Rating of User");

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function getTotalDaysInMonth(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    
    const totalDays = new Date(year, month, 0).getDate();
    console.log(totalDays);

    return totalDays;
  }

  async function getAllRatings() {
    setLoading(true);
    try {
      let dataToSend = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        userRating: true,
      };
      const rating = await getRatings(dataToSend);
      if (rating.error) {
        // console.log(rating?.error);
        setLoading(false);
      } else {
        let dataToSet = [];
        const currentDate = new Date();
        const firstDateOfMonth = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        for (
          let i = firstDateOfMonth;
          i <= currentDate;
          i.setDate(i.getDate() + 1)
        ) {
          const isToday =
            i.getDate() === currentDate.getDate() &&
            i.getMonth() === currentDate.getMonth() &&
            i.getFullYear() === currentDate.getFullYear();
          // if (!isToday) {
          //   dataToSet.push({
          //     id: i.getTime(),
          //     title: "A",
          //     start: new Date(i),
          //     end: new Date(i),
          //   });
          // }
        }

        const ratingData = rating.data?.[0]?.ratings;
        // // console.log(ratingData, "---------------------------------rating data");

        if (ratingData) {
          const ratingEvents = ratingData.map((item, index) => ({
            id: index,
            title: `${item.rating?.toFixed(2)}`,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          }));
          dataToSet = [...dataToSet, ...ratingEvents];
        }

        // // console.log(dataToSet, "---------------------------------data to set");
        setMyRatings(dataToSet);
        setLoading(false);
      }
    } catch (error) {
      // console.log("error", error);
      setLoading(false);
    }
  }

  const handleDateChange = (event, s, a) => {
    if (a === "DATE") {
      setSelectedRatingDate(event);
      // console.log(a, "event");
      return;
    }

    setSelectedDate(event);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const currentDate = new Date();
    if (event.title === "A" && event.start < currentDate) {
      return {
        className: "red-event",
      };
    }
    return {};
  };

  // const getRatingDetail = async () => {
  //   setRatingDetail([]);
  //   let dataToSend = {
  //     date: selectedRatingDate.getDate(),
  //     month: selectedRatingDate.getMonth() + 1,
  //     year: selectedRatingDate.getFullYear(),
  //   };
  //   const rating = await getRatingsDetailsByID(dataToSend);
  //   if (rating.error) {
  //     // console.log(rating?.error);
  //     setLoading(false);
  //   } else {
  //     if (!rating.data || rating.data.length === 0) {
  //       // Check if rating data is empty
  //       setShowModal(false);
  //     } else {
  //       setLoading(true);
  //       setRatingDetail(rating.data);
  //       setShowModal(true);
  //     }
  //     setLoading(false);
  //   }
  // };

  // const LineGraph = () => {
  //   const lineChartData = {
  //     labels: Array.from({ length: daysInThisMonth() }, (_, i) => i + 1),
  //     datasets: [
  //       {
  //         label: "Rating",
  //         data: userRatingForGraph,
  //         fill: false,
  //         borderColor: "rgb(75, 192, 192)",
  //         tension: 0.1,
  //       },
  //     ],
  //   };

  //   const lineChartOptions = {
  //     scales: {
  //       x: {
  //         type: "linear",
  //         min: 1,
  //         max: daysInThisMonth(),
  //         ticks: {
  //           stepSize: 1,
  //         },
  //       },
  //       y: {
  //         beginAtZero: true,
  //         max: 6,
  //       },
  //     },
  //   };

  //   return (
  //     <div className="line-chart">
  //       <Line data={lineChartData} options={lineChartOptions} />
  //     </div>
  //   );
  // };

  const getDatesForXAxis = () => {
 
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
  
      if (
        selectedDate.getFullYear() === currentYear &&
        selectedDate.getMonth() === currentMonth
      ) {
        const totalDays = currentDate.getDate();
        return Array.from({ length: totalDays }, (_, i) => i + 1);
      }
  
      return Array.from({ length: getTotalDaysInMonth(selectedDate) }, (_, i) => i + 1);
    
  };

  const LineGraph = () => {
    const lineChartData = {
      labels: getDatesForXAxis(),
      datasets: [
        {
          label: "Rating",
          data: userRatingForGraph,
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          steppedLine: true,
        },
      ],
    };

    const lineChartOptions = {
      scales: {
        x: {
          type: "linear",
          min: 1,
          max: getTotalDaysInMonth(selectedDate),
          ticks: {
            stepSize: 1,
          },
        },
        y: {
          beginAtZero: true,
          max: 6,
        },
      },
    };

    return (
      <div className="line-chart">
        <Line data={lineChartData} options={lineChartOptions} height={250} />
      </div>
    );
  };

  const daysInThisMonth = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const daysUntilCurrentDate = Math.min(
      currentDate.getDate(),
      lastDayOfMonth.getDate()
    );
    return (
      lastDayOfMonth.getDate() -
      firstDayOfMonth.getDate() +
      1 -
      (lastDayOfMonth.getDate() - daysUntilCurrentDate)
    );
  };

  return (
    <>
      <Row>
        <Col lg={6}>
          <div className="rating-graph ">
            <LineGraph />
          </div>
        </Col>
        <Col lg={6}>
          <div className="">
            <div id="calender-ui">
              <Calendar
                events={myRatings}
                localizer={localizer}
                views={["month"]}
                defaultView={"month"}
                defaultDate={new Date()}
                onNavigate={(a, e, s) => handleDateChange(a, e, s)}
                // onClick={handleDateChange}
                className=""
                style={{ height: 400 }}
                eventPropGetter={eventStyleGetter}
              />
            </div>
            {loading ? <Loader /> : null}
          </div>
        </Col>
      </Row>

      <Offcanvas
        show={showModal}
        style={{ width: "600px" }}
        onHide={() => setShowModal(false)}
        placement="end"
        className="my-offcanvas"
      >
        <Offcanvas.Header closeButton className="my-offcanvas-header">
          <Offcanvas.Title className="my-offcanvas-title">
            Rating Details
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="my-offcanvas-body">
          <div className="rating-details">
            <div className="rating-details__date">
              <span>Date:</span>
              <span>
                {selectedRatingDate.getDate() +
                  "-" +
                  (selectedRatingDate.getMonth() + 1) +
                  "-" +
                  selectedRatingDate.getFullYear()}
              </span>
            </div>
            <div className="rating-details__rating">
              <span>Average Rating:</span>
              <span>
                {ratingDetail?.rating !== 0
                  ? (ratingDetail?.rating || 0).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="rating-details__rating">
              {ratingDetail && (
                <Accordion className="my-accordion">
                  {ratingDetail?.taskIds?.map((task) => (
                    <Accordion.Item key={task?._id} eventKey={task?._id}>
                      <Accordion.Header
                        onClick={() => setActiveTask(task?._id)}
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        className="my-accordion-header"
                      >
                        {task?.title}
                      </Accordion.Header>
                      <Accordion.Body collapsible className="my-accordion-body">
                        <div className="task-rating">
                          <p>Rating: {task?.rating}</p>
                          {task?.ratingComments && (
                            <p>Comment: {task?.ratingComments[0]?.comment}</p>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

// export default MyCalendar;
