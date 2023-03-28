import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { myevents, myresources } from "./data";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { getRatings } from "../../services/user/api";

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
  // export const MyCalendar = () => (
  const [myRatings, setMyRatings] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selected, setSelectedDate] = useState();

  useEffect(() => {
    getAllRatings();
  }, [selectedDate]);

  async function getAllRatings(data) {
    // setLoading(true);
    try {
      let dataToSend = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        userRating: true,
      };
      const rating = await getRatings(dataToSend);
      //   setLoading(false);
      if (rating.error) {
        // setToasterMessage(rating?.error?.message || "Something Went Wrong");
        // setShowToaster(true);
      } else {
        // let
        // {
        // 	id: 0,
        // 	title: "training",
        // 	start: new Date(2023, 5, 8, 9, 0, 0),
        // 	end: new Date(2023, 5, 8, 13, 0, 0),
        // 	resourceId: 1,
        //   },

        let dataToSet = rating.data?.[0]?.ratings?.map((item, index) => {
          return {
            id: index,
            title: item.rating,
            start: new Date(item.year, item.month - 1, item.date),
            end: new Date(item.year, item.month - 1, item.date),
          };
        });
        console.log("rating", dataToSet);

        setMyRatings(dataToSet);
      }
    } catch (error) {
      //   setToasterMessage(error?.error?.message || "Something Went Wrong");
      //   setShowToaster(true);
      //   setLoading(false);
    }
  }

  const handleDateChange = (event) => {
    console.log("date change,", event);

    setSelectedDate(event);
  };
  return (
    <div className="calendars">
      <div>
        {/* <h4 style={{marginTop:'10px'}}>My Ratings</h4> */}
        <Calendar
          events={myRatings}
          localizer={localizer}
          views={["month"]}
          view={"month"}
          defaultDate={new Date()}
          onNavigate={handleDateChange}
          style={{ height: 400 }}
          onView={(view) => {
            this.setState({ view });
          }}
        />
      </div>
    </div>
  );
}

// export default MyCalendar;
