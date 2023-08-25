  /**
   * @description formats date
   * @param {*} dateString
   * @returns formatted date
   */
  function formatDate(dateString) {
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
  function convertToUTCDay(dateString) {
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

  function convertToUTCNight(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    return localTimeString;
  }

  function formatDateToTeam(date) {
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

  function formatDateToRating(dateString) {
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


  function formatDateToProfile(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  function convertToUTCDayCalendar(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0));
    return utcTime;
  }
  function convertToUTCForDayCalendar(dateString) {
    const newDate = new Date(
      dateString.getFullYear(),
      dateString.getMonth(),
      dateString.getDate() + 1
    );
    let utcTime = newDate.toISOString()?.split("T")[0] + "T00:00:00.000Z";
    return utcTime;
  }

  function convertToUTCForNightCalendar(dateString) {
    const newDate = new Date(
      dateString.getFullYear(),
      dateString.getMonth(),
      dateString.getDate() + 1
    );
    let utcTime = newDate.toISOString()?.split("T")[0] + "T23:59:59.999Z";
    return utcTime;
  }

  function convertToUTCNightCalendar(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    return utcTime;
  } 
