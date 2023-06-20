import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatings, getRatingsDetailsByID } from "../../../services/user/api";
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
  console.log(
    selectedUserId,
    "---------------------------------selectedUserId"
  );

  const [myRatings, setMyRatings] = useState([]);
  const [myGraphRatings, setMyGraphRatings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRatingDate, setSelectedRatingDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [ratingDetail, setRatingDetail] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [userRatingForGraph, setUserRatingForGraph] = useState([]);

  useEffect(() => {
    getAllRatings();
    getUserRatings();
  }, [selectedDate]);

  async function getUserRatings() {
    setLoading(true);
    try {
      let dataToSend = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        userRating: true,
      };
      if (selectedUserId) {
        dataToSend.userId = selectedUserId;
      }

      const rating = await getRatings(dataToSend);
      if (rating.error) {
        console.log(rating?.error);
        setLoading(false);
      } else {
        let userRatingObj = {};
        rating.data?.[0]?.ratings?.forEach((element) => {
          userRatingObj[element.date] = element.rating;
        });
        let userRatingForGraph = [];
        for (let i = 1; i < daysInThisMonth(); i++) {
          if (!userRatingObj[i]) {
            userRatingObj[i] = userRatingObj[i - 1] || 5; // REMOVE IT AND HANDLE IF date 1 rating is not there
          }
          userRatingForGraph.push(userRatingObj[i]);
        }
        setUserRatingForGraph(userRatingForGraph);
        console.log(
          userRatingForGraph,
          "---------------------------------Rating of User"
        );
      }
    } catch (error) {
      setLoading(false);
    }
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
        console.log(rating?.error);
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
        console.log(ratingData, "---------------------------------rating data");

        if (ratingData) {
          const ratingEvents = ratingData.map((item, index) => ({
            id: index,
            title: `${item.rating?.toFixed(2)}`,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          }));
          dataToSet = [...dataToSet, ...ratingEvents];
        }

        console.log(dataToSet, "---------------------------------data to set");
        setMyRatings(dataToSet);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  const LineGraph = () => {
    const lineChartData = {
      labels: Array.from({ length: daysInThisMonth() }, (_, i) => i + 1),
      datasets: [
        {
          label: "Rating",
          data: userRatingForGraph,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    const lineChartOptions = {
      scales: {
        x: {
          type: "linear",
          min: 1,
          max: daysInThisMonth(),
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
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    );
  };

  const daysInThisMonth = () => {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
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
          {/* Add more options for other months */}
        </select>
      </div>

      <LineGraph />

      <div className="">{loading ? <Loader /> : null}</div>
    </>
  );
}
