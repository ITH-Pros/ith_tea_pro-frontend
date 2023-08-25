  /**
   * @description formats date
   * @param {*} dateString
   * @returns formatted date
   */
  export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  /**
   * @description converts to UTC day
   * @param {*} dateString
   * @returns UTC converted date
   */
  export function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    return localTimeString;
  }

  /**
   * @description converts to UTC night
   * @param {*} dateString
   * @returns UTC converted date
   */

  export function convertToUTCNight(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    return localTimeString;
  }

  export function formatDateToTeam(date) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayBefore = new Date(date);
    dayBefore.setDate(dayBefore.getDate());
    const dayOfWeek = days[dayBefore.getDay()];
    const dayOfMonth = dayBefore.getDate();

    return (
      <span>
        <p>
          {dayOfWeek} - <span>{dayOfMonth}</span>
        </p>
      </span>
    );
  }

  export function formatDateToRating(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    if (day && month && year) {
      return `${day}/${month}/${year}`;
    } else {
      return "--";
    }
  }


  export function formatDateToProfile(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  export function convertToUTCDayCalendar(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0));
    return utcTime;
  }

  export function convertToUTCForDayCalendar(dateString) {
    const newDate = new Date(
      dateString.getFullYear(),
      dateString.getMonth(),
      dateString.getDate() + 1
    );
    let utcTime = newDate.toISOString()?.split("T")[0] + "T00:00:00.000Z";
    return utcTime;
  }

  export  function convertToUTCForNightCalendar(dateString) {
    const newDate = new Date(
      dateString.getFullYear(),
      dateString.getMonth(),
      dateString.getDate() + 1
    );
    let utcTime = newDate.toISOString()?.split("T")[0] + "T23:59:59.999Z";
    return utcTime;
  }

  export function convertToUTCNightCalendar(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    return utcTime;
  } 


  export  const MinutesToDaysHoursMinutes = (props) => {
    const minutes = props.minutes;
    const days = Math.floor(minutes / 1440); // 24 hours * 60 minutes = 1440 minutes in a day
    const hours = Math.floor((minutes % 1440) / 60);
    const remainingMinutes = minutes % 60;

    return (
      <div className="task-completion-time d-block">
        <label className="form-label">Task Completion Time : </label> <br />
        <div className="time-details">
          {days > 0 && <p>Days: {days}</p>}
          {hours > 0 && <p>Hours: {hours}</p>}
          {remainingMinutes > 0 && <p>Minutes: {remainingMinutes}</p>}
        </div>
      </div>
    );
  };

  export function getTotalDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }


  export function eventStyleGetter(event) {
    const currentDate = new Date();
    if (event.title === "A" && event.start < currentDate) {
      return {
        className: "red-event",
      };
    }
    return {};
  };

  export const getDatesForXAxis = (selectedDate) => {
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
  };