import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { myevents, myresources } from "./data";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./dashboard.css";

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

export const MyCalendar = () => (
  <>
    <div className="calendars">
      <div>
        <h1>calendar1</h1>
        <Calendar
          events={myevents}
          localizer={localizer}
          defaultDate={new Date(2021, 5, 8)}
          style={{ height: 700 }}
        />
      </div>

      {/* <div>
        <h1>calendar2</h1>
        <Calendar
          events={myevents}
          resources={myresources}
          localizer={localizer}
          defaultView="day"
          defaultDate={new Date(2021, 5, 8)}
          style={{ height: 700 }}
        />
      </div> */}
    </div>
  </>
);

export default MyCalendar;