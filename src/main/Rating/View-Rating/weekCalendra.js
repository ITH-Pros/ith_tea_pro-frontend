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
        let dataToSet = rating.data?.[0]?.ratings?.map((item, index) => {
          return {
            id: index,
            title: item.rating,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          };
        });
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
            onRangeChange={(el) => console.log("el", el)}
            onNavigate={handleDateChange}
            style={{ height: 400 }}
            backgroundEvents={(el) => console.log("el", el)}
          />
        </div>
      {loading ? <Loader /> : null}

      </div>
    </>
  );
}
