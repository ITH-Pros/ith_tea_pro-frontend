import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useContext, useEffect, useState } from "react";
import { getRatings } from "@services/user/api";
import Loader from "../Shared/Loader";
import { Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./weekCalender.css";
import  { enUS } from "date-fns/locale"
import { useAuth } from "../../utlis/AuthProvider";
// import { useAuth } from "../../../auth/AuthProvider";

Chart.register(...registerables);

const locales = {
  "en-US": enUS
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userRatingForGraph, setUserRatingForGraph] = useState([]);
  const { userDetails } = useAuth();

  useEffect(() => {
    const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
    if (!allowedRoles.includes(userDetails?.role)) {
      getAllRatings();
      getUserRatings();
    }
  }, [selectedDate]);

  async function getUserRatings() {
    console.log("getUserRatings form weekCalendra.js");
    setLoading(true);
    try {
      const dataToSend = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        userRating: true,
      };

      const rating = await getRatings(dataToSend);
      if (rating.error) {
        setLoading(false);
      } else {
        getAllRatings(rating);
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

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function getTotalDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }

  async function getAllRatings(rating) {
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
        }

        const ratingData = rating?.data?.[0]?.ratings;

        if (ratingData) {
          const ratingEvents = ratingData.map((item, index) => ({
            id: index,
            title: `${item.rating?.toFixed(2)}`,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          }));
          dataToSet = [...dataToSet, ...ratingEvents];
        }

        setMyRatings(dataToSet);
  }

  const handleDateChange = (event) => {
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

    return Array.from(
      { length: getTotalDaysInMonth(selectedDate) },
      (_, i) => i + 1
    );
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
                onNavigate={handleDateChange}
                className=""
                style={{ height: 400 }}
                eventPropGetter={eventStyleGetter}
              />
            </div>
            {loading ? <Loader /> : null}
          </div>
        </Col>
      </Row>
    </>
  );
}
