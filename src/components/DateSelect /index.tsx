import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelect = (props: any) => {
  // (date) => setStartDate(date)
  return <DatePicker selected={props.value} onChange={props.onChange}  />;
};

export default DateSelect;
