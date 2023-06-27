import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatingsByUser } from "../../../services/user/api";
import Loader from "../../../components/Loader";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Row, Col } from "react-bootstrap";

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
  const [monthOption ,setMonthOption] = useState([]);

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    // Modify the month options based on the selected year
    if (viewMode === "month") {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const monthOptionsCopy = [...monthOptions];
        const newMonthOptions = monthOptionsCopy.filter((month) => {
            if (selectedDate.getFullYear() === currentYear) {
                return month.value <= currentMonth;
            } else {
                return month;
            }
            }
        );
        setMonthOption(newMonthOptions);
    }


  }, [selectedDate]);

  

  // Year dropdown options
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = 2021; year <= currentYear; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }
  

  useEffect(() => {
    getUserRatings();
    console.log("selectedUserId", selectedDate);
  }, [selectedDate, selectedUserId, viewMode]);

  async function getUserRatings() {
    setLoading(true);
    try {
      let dataToSend = {};

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

        if (viewMode === "month") {
          rating.data?.[0]?.ratings?.forEach((element) => {
            userRatingObj[element.date] = element.rating;
          });
        } else if (viewMode === "year") {
          rating.data?.[0]?.monthlyAverages?.forEach((element) => {
            userRatingObj[element.month] = element.avg;
          });
        }

        let userRatingForGraph = [];
        const totalDays = getTotalDaysInMonth(selectedDate);

        for (let i = 1; i <= totalDays; i++) {
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

  //   const getDatesForXAxis = () => {
  //     if (viewMode === "year") {
  //       const currentYear = new Date().getFullYear();
  //       if (selectedDate.getFullYear() === currentYear) {
  //         const currentMonth = new Date().getMonth() + 1;
  //         return Array.from({ length: currentMonth }, (_, i) => i + 1);
  //       }
  //       return Array.from({ length: 12 }, (_, i) => i + 1);
  //     } else {
  //       const totalDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  //       return Array.from({ length: totalDays }, (_, i) => i + 1);
  //     }
  //   };

  const getDatesForXAxis = () => {
    if (viewMode === "year") {
      const currentYear = new Date().getFullYear();
      if (selectedDate.getFullYear() === currentYear) {
        const currentMonth = new Date().getMonth() + 1;
        return Array.from({ length: currentMonth }, (_, i) => i + 1);
      }
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
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
    }
  };

  function getTotalDaysInMonth(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1

    const totalDays = new Date(year, month, 0).getDate();
    console.log(totalDays);

    return totalDays;
  }

  const daysInMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysUntilCurrentDate = Math.min(
      date.getDate(),
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

  //   const handleYearChange = (event) => {
  //     const selectedYear = parseInt(event.target.value);
  //     if (viewMode === "month") {
  //       setSelectedDate((prevDate) => {
  //         const newDate = new Date(prevDate);
  //         newDate.setFullYear(selectedYear);
  //         return newDate;
  //       });
  //     }
  //   };

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
    if (viewMode === "month") {
      setSelectedDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setMonth(selectedMonth - 1);
        return newDate;
      });
    }
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
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
      ],
    };

    const lineChartOptions = {
      scales: {
        x: {
          type: "linear",
          min: 1,
          max: viewMode === "year" ? 12 : getTotalDaysInMonth(selectedDate),
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

  return (
    <>
      <Row className="mb-4">
        <Col lg={4}>
          <div>
            <select
              className="form-control"
              placeholder="View Mode"
              id="view-mode"
              onChange={handleViewModeChange}
              value={viewMode}
            >
              <option value="month">Month Wise</option>
              <option value="year">Year Wise</option>
            </select>
          </div>
        </Col>
        <Col lg={4}>
          {viewMode === "month" && (
            <div>
              <select
                placeholder="Month"
                className="form-control"
                id="month"
                onChange={handleMonthChange}
                value={selectedDate.getMonth() + 1}
                // disabled={selectedDate.getFullYear() === currentYear && selectedDate.getMonth() + 1 > currentMonth}
              >
                {monthOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Col>
        <Col lg={4}>
          <div>
            <select
              placeholder="Year"
              className="form-control"
              id="year"
              onChange={handleYearChange}
              value={selectedDate.getFullYear()}
            //   disabled={selectedDate.getFullYear() > currentYear}
              
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
      <LineGraph />
      <div className="">{loading ? <Loader /> : null}</div>
    </>
  );
}
