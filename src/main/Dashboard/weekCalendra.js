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
export default function MyCalendar(){
// export const MyCalendar = () => (
	const [myRatings, setMyRatings]=useState();
	useEffect(() => {
		getAllRatings();
	  }, []);

	async function getAllRatings(data) {
		// setLoading(true);
	
		try {
		  if (!data) {
			// data = {
			// 	previousWeek: data,
			// 	weekCount: weekCount
			// };
		  }
		  const rating = await getRatings(data);
		//   setLoading(false);
	
		  if (rating.error) {
			// setToasterMessage(rating?.error?.message || "Something Went Wrong");
			// setShowToaster(true);
		  } else {
			// setRatings([...rating.data]);
		  }
		} catch (error) {
		//   setToasterMessage(error?.error?.message || "Something Went Wrong");
		//   setShowToaster(true);
		//   setLoading(false);
		}
	  }
return (
    <div className="calendars">
      <div>
        {/* <h4 style={{marginTop:'10px'}}>My Ratings</h4> */}
        <Calendar
          events={myevents}
          localizer={localizer}
		  views={['month']}
		  view={'month'}
          defaultDate={new Date()}
          style={{ height: 400 }}
		  onView={(view)=>{
			this.setState({view})
		}}
        />
      </div>

      
    </div>
);
}

// export default MyCalendar;