/* eslint-disable react-hooks/exhaustive-deps */
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatings } from "../../../services/user/api";
import Loader from "../../../components/Loader";

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
  const [myRatings, setMyRatings] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getAllRatings();
  }, [selectedDate]);

  async function getAllRatings(data) {
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
        for (let i = firstDateOfMonth; i < currentDate; i.setDate(i.getDate() + 1)) {
          dataToSet.push({
            id: i.getTime(),
            title: "A",
            start: new Date(i),
            end: new Date(i),
          });
        }
        const ratingData = rating.data?.[0]?.ratings;
        if (ratingData) {
          const ratingEvents = ratingData.map((item, index) => ({
            id: index,
            title: `${item.rating?.toFixed(2)}`,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          }));
          dataToSet = [...dataToSet, ...ratingEvents];
        }
        console.log(dataToSet, '---------------------------------data to set');
        setMyRatings(dataToSet);
        setLoading(false);
      
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  return (
    <>
      <div className="calendars">
        <div>
          <Calendar
            events={myRatings}
            localizer={localizer}
            views={["month"]}
            view={"month"}
            defaultDate={new Date()}
            onNavigate={handleDateChange}
            className=""
            style={{ height: 400  }}
          />
        </div>
      {loading ? <Loader /> : null}

      </div>
    </>
  );
}
