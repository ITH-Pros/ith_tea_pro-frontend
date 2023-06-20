
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
    const {selectedUserId} = props;
    console.log(selectedUserId, "---------------------------------selectedUserId");

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
      if(selectedUserId){
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
        console.log(userRatingForGraph, "---------------------------------Rating of User");
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
        const firstDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        for (let i = firstDateOfMonth; i <= currentDate; i.setDate(i.getDate() + 1)) {
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




//   const getRatingDetail = async () => {
//     setRatingDetail([]);
//     let dataToSend = {
//       date: selectedRatingDate.getDate(),
//       month: selectedRatingDate.getMonth() + 1,
//       year: selectedRatingDate.getFullYear(),
//     };
//     const rating = await getRatingsDetailsByID(dataToSend);
//     if (rating.error) {
//       console.log(rating?.error);
//       setLoading(false);
//     } else {
//       if (!rating.data || rating.data.length === 0) {
//         // Check if rating data is empty

//       } else {
//         setLoading(true);
//         setRatingDetail(rating.data);
//       }
//       setLoading(false);
//     }
//   };

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

  return (
    <>
     {/* <div className=""> */}
        <LineGraph />
      {/* </div> */}
      
      <div className="">
        {loading ? <Loader /> : null}
      </div>
    </>
  );
}

// export default MyCalendar;




