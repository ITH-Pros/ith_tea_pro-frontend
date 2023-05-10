import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getRatings, getRatingsDetailsByID } from "../../../services/user/api";
import Loader from "../../../components/Loader";
import { Accordion, Modal } from "react-bootstrap";
import "./weekCalender.css";
import Offcanvas from 'react-bootstrap/Offcanvas';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedRatingDate, setSelectedRatingDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [ratingDetail, setRatingDetail] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    getAllRatings();
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRatingDate ) {
      getRatingDetail();
      
    }
  }, [ selectedRatingDate]);

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
        const firstDateOfMonth = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        for (
          let i = firstDateOfMonth;
          i <= currentDate;
          i.setDate(i.getDate() + 1)
        ) {
          const isToday =
            i.getDate() === currentDate.getDate() &&
            i.getMonth() === currentDate.getMonth() &&
            i.getFullYear() === currentDate.getFullYear();
          if (!isToday) {
            dataToSet.push({
              id: i.getTime(),
              title: "A",
              start: new Date(i),
              end: new Date(i),
            });
          }
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
        console.log(dataToSet, "---------------------------------data to set");
        setMyRatings(dataToSet);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  const handleDateChange = (event, s, a) => {
    if (a === "DATE") {
      setSelectedRatingDate(event);
      setShowModal(true);
      console.log(a, "event");
      return;
    }

    setSelectedDate(event);
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    const currentDate = new Date();
    if (event.title === "A" && event.start < currentDate) {
      return {
        className: "red-event",
      };
    }
    return {};
  };

  const getRatingDetail = async () => {
    setLoading(true);
    setRatingDetail([]);
    let dataToSend = {
      date: selectedRatingDate.getDate(),
      month: selectedRatingDate.getMonth() + 1,
      year: selectedRatingDate.getFullYear(),
    };
    const rating = await getRatingsDetailsByID(dataToSend);
    if (rating.error) {
      console.log(rating?.error);
      setLoading(false);
    } else {
      if (!rating.data || rating.data.length === 0) { // Check if rating data is empty
        setShowModal(false);
      } else {
        setRatingDetail(rating.data);
      }
      setLoading(false);
    }
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
            onNavigate={(a, e, s) => handleDateChange(a, e, s)}
            // onClick={handleDateChange}
            className=""
            style={{ height: 400 }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
        {loading ? <Loader /> : null}
      </div>



<Offcanvas show={showModal} style={{ width: '600px' }} onHide={() => setShowModal(false)} placement="end" className="my-offcanvas">
  <Offcanvas.Header closeButton className="my-offcanvas-header">
    <Offcanvas.Title className="my-offcanvas-title">Rating Details</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body className="my-offcanvas-body">
    <div className="rating-details">
      <div className="rating-details__date">
        <span>Date:</span>
        <span>
          {selectedRatingDate.getDate() +
            '-' +
            (selectedRatingDate.getMonth() + 1) +
            '-' +
            selectedRatingDate.getFullYear()}
        </span>
      </div>
      <div className="rating-details__rating">
        <span>Average Rating:</span>
        <span>{ratingDetail?.rating || 'Not Rated Yet'}</span>
      </div>
      <div className="rating-details__rating">
        {ratingDetail && (
          <Accordion className="my-accordion">
            {ratingDetail?.taskIds?.map((task) => (
              <Accordion.Item key={task?._id} eventKey={task?._id}>
                <Accordion.Header
                  onClick={() => setActiveTask(task?._id)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  className="my-accordion-header"
                >
                  {task?.title}
                </Accordion.Header>
                <Accordion.Body collapsible className="my-accordion-body">
                  <div className="task-rating">
                    <p>Rating: {task?.rating}</p>
                    {task?.ratingComments && (
                      <p>Comment: {task?.ratingComments[0]?.comment}</p>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  </Offcanvas.Body>
</Offcanvas>


    </>
  );
}
