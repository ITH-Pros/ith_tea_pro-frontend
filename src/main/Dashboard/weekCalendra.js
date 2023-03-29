import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { myevents, myresources } from "./data";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { getRatings } from "../../services/user/api";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import moment from "moment";

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
let currentYear = moment().year();
var month = moment().month();
export default function MyCalendar() {
  // export const MyCalendar = () => (
  const [myRatings, setMyRatings] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthUse, setMonth] = useState(moment().format("MMMM"));
  const [yearUse, setYear] = useState(currentYear);

  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];
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

      if (rating.error) {
    
      } else {
     

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
      console.log("error", error);
    }
  }

  const onchangeMonth = (e) => {
    setMonth(e.target.value);
    let dataToSend = {
      month: months.indexOf(e.target.value) + 1,
      year: yearUse,
    };
    let monthDays = new Date(yearUse, months.indexOf(e.target.value) + 1, 0);
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        months.indexOf(e.target.value),
        selectedDate.getDate()
      )
    );
    // getAllRatings(dataToSend);
  };
  const onChangeYear = (e) => {
    setYear(e.target.value);
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: e.target.value,
    };
    setSelectedDate(
      new Date(
        e.target.value,
        selectedDate.getMonth() + 1,
        selectedDate.getDate()
      )
    );

    // getAllRatings(dataToSend);
  };

  const handleDateChange = (event) => {
    console.log("date change,", event);

    setSelectedDate(event);
  };
  return (
    <>
      {/* <h5 className="text-center h5cls">
        <p
          style={{
            marginRight: "10px",
            marginTop: "6px",
            fontSize: "14",
          }}
        >
          Ratings for
        </p>
        <Form.Group as={Col} md="2" controlId="select_month">
          <Form.Control
            className="month-drop-select"
            required
            as="select"
            type="select"
            name="select_team"
            onChange={onchangeMonth}
            value={monthUse}
          >
            <option value="" disabled>
              Select Month
            </option>
            {months.map((monthh, index) => (
              <option
                value={monthh}
                key={monthh}
                disabled={index > month && yearUse >= currentYear}
              >
                {monthh}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} md="2" controlId="select_year">
          <Form.Control
            className="year-drop-select"
            required
            as="select"
            type="select"
            name="select_team"
            onChange={onChangeYear}
            value={yearUse}
          >
            <option value="" disabled>
              Select Year
            </option>
            {years.map((year) => (
              <option value={year} key={year} disabled={year > currentYear}>
                {year}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </h5> */}
      <div className="calendars">
        <div>
          {/* <h4 style={{marginTop:'10px'}}>My Ratings</h4> */}
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
            // onView={(view) => {
            //   this.setState({ view });
            //   console.log("view------", view);
            // }}
          />
        </div>
      </div>
    </>
  );
}

// export default MyCalendar;
