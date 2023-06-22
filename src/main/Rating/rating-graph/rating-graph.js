import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatings, getRatingsByUser } from "../../../services/user/api";
import Loader from "../../../components/Loader";

import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

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

export default function RatingGraph(props) {
  const { selectedUserId } = props;

  const [myGraphRatings, setMyGraphRatings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userRatingForGraph, setUserRatingForGraph] = useState([]);
  const [viewMode, setViewMode] = useState("month");

  useEffect(() => {
    getUserRatings();
  }, [selectedDate, selectedUserId, viewMode]);

  async function getUserRatings() {
    setLoading(true);
    try {
      let dataToSend = {
        // userRating: true,
      };

      if (viewMode === "month") {
        dataToSend.month = selectedDate.getMonth() + 1;
        dataToSend.year = selectedDate.getFullYear();
        dataToSend.ratingDuration = "Monthly";
      } else if (viewMode === "year") {
        dataToSend.year = selectedDate.getFullYear();
        dataToSend.ratingDuration = "Yearly";
      }

      if (selectedUserId) {
        dataToSend.userId = selectedUserId;
      }
      const rating = await getRatingsByUser(dataToSend);

      if (rating.error) {
        console.log(rating?.error);
        setLoading(true);
      } else {

        let userRatingObj = {};

        if(viewMode === "month"){

        rating.data?.[0]?.ratings?.forEach((element) => {
          userRatingObj[element.date] = element.rating;
        });
        }else if(viewMode === "year"){
            rating.data?.[0]?.monthlyAverages?.forEach((element) => {
                userRatingObj[element.month] = element.avg;
                });
        }

        let userRatingForGraph = [];
        const currentMonthDays = daysInThisMonth();

        for (let i = 1; i <= currentMonthDays; i++) {
          if (!userRatingObj[i]) {
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

  const LineGraph = () => {
    const lineChartData = {
      labels:
        viewMode === "year"
          ? Array.from({ length: 12 }, (_, i) => i + 1)
          : Array.from({ length: daysInThisMonth() }, (_, i) => i + 1),
      datasets: [
        {
            label: "Rating",
            data: userRatingForGraph,
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Adjust the alpha value to make it lighter
            tension: 0.1,
          }
      ],
    };

    const lineChartOptions = {
      scales: {
        x: {
          type: "linear",
          min: 1,
          max: viewMode === "year" ? 12 : daysInThisMonth(),
          ticks: {
            stepSize: 1,
          },
          ...(viewMode === "year" && { callback: (value) => `Month ${value}` }),
        },
        y: {
          min: 0,
          max: 6,
          ticks: {
            stepSize: 1,
          },
          callback: (value) => `${value}/6`,
        },
      },
    };

    return (
      <div>
        <Line data={lineChartData} options={lineChartOptions} />
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

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(selectedYear);
      return newDate;
    });
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(selectedMonth - 1);
      return newDate;
    });
  };

  return (
    <>
      <div>
        <label htmlFor="view-mode">View Mode:</label>
        <select id="view-mode" onChange={handleViewModeChange} value={viewMode}>
          <option value="month">Month Wise</option>
          <option value="year">Year Wise</option>
        </select>
      </div>

      {viewMode === "month" && (
        <div>
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            onChange={handleMonthChange}
            value={selectedDate.getMonth() + 1}
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="year">Year:</label>
        <select
          id="year"
          onChange={handleYearChange}
          value={selectedDate.getFullYear()}
        >
          <option value={2021}>2021</option>
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
          {/* Add more options for other years */}
        </select>
      </div>

      <LineGraph />

      <div className="">{loading ? <Loader /> : null}</div>
    </>
  );
}
