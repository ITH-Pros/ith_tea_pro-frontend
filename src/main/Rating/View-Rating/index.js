import React from "react";
import moment from "moment";

import { useState, useEffect } from "react";
import "./index.css";
import { MDBTooltip } from "mdb-react-ui-kit";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Table,
  Modal,
} from "react-bootstrap";
import Avatar from "react-avatar";
import {
  getAllUsers,
  getAllUserWithoutPagination,
  getRatings,
} from "../../../services/user/api";
import { useAuth } from "../../../auth/AuthProvider";
import RatingBox from "../../../components/ratingBox";
// import MyCalendar from "../../Dashboard/weekCalendra";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";
import AddRatingModal from "../add-rating-modal";
import AddRating from "../add-rating";
import MyCalendar from "../../Dashboard/weekCalendra";

var month = moment().month();
let currentYear = moment().year();
export default function Dashboard(props) {
  const [usersArray, setTeamOptions] = useState([]);
  const [ratingsArray, setRatings] = useState([]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamView, setTeamView] = useState(false);

  const setShowToaster = (param) => showToaster(param);
  const { userDetails } = useAuth();

  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onInit() {
    getUsersList();
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: yearUse,
    };
    getAllRatings(dataToSend);
  }

  const [days, setDays] = useState(moment().daysInMonth());
  const [monthUse, setMonth] = useState(moment().format("MMMM"));
  const [yearUse, setYear] = useState(currentYear);

  const onchangeMonth = (e) => {
    setMonth(e.target.value);
    let dataToSend = {
      month: months.indexOf(e.target.value) + 1,
      year: yearUse,
    };
    let monthDays = new Date(yearUse, months.indexOf(e.target.value) + 1, 0);
    setDays(monthDays.getDate());
    getAllRatings(dataToSend);
  };
  const onChangeYear = (e) => {
    setYear(e.target.value);
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: e.target.value,
    };
    getAllRatings(dataToSend);
  };

  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];

  const getUsersList = async function () {
    setLoading(true);
    try {
      const user = await getAllUserWithoutPagination();
      setLoading(false);

      if (user.error) {
        setToasterMessage(user?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setTeamOptions([...user.data]);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  async function getAllRatings(data) {
    setLoading(true);

    try {
      if (!data) {
        data = {
          month: months.indexOf(monthUse) + 1,
          year: yearUse,
        };
      }
      const rating = await getRatings(data);
      setLoading(false);

      if (rating.error) {
        setToasterMessage(rating?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setRatings([...rating.data]);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
    }
  }



  return (

	<div> 
	<div className="dashboard_camp"> 
	<h4>My Ratings 
		<button className="addTaskBtn" onClick={() => setTeamView(!teamView)} style={{float:'right'}}> {teamView?'Self view':'Team View'} </button>
	</h4>
	
	</div>
	

	{teamView ? (
		<div className="dashboard_camp">
		<div className="d-flex justify-content-center flex-column">
		  <div className="d-flex" style={{marginTop:'10px'}}>
		
			<h5 className="text-center h5cls">
			  <p style={{ marginRight: "10px", marginTop: "6px", fontSize:'14' }}>Ratings for</p>
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
			</h5>
  
			{/* <Link to="/rating" params={{ params: true }}> */}
			<div className="wrap btnWth">
			
			{userDetails?.role !== "CONTRIBUTOR" && (
			  <button className="add-rating-button">
		  <AddRating />
				
			  </button>)}
			 
			</div>
			{/* </Link> */}
		  </div>
		  <Table responsive className="ratingTable">
			<thead>
			  <tr>
				<th style={{width:'140'}}>Name</th>
				{Array(days)
				  .fill(0)
				  .map((rating, index) => {
					return (
					  <th className="dates text-center" key={`${index}_${index}`}>
						{index + 1 < 10 ? "0" + (index + 1) : index + 1}
					  </th>
					);
				  })}
				<th style={{ color: "green" }}>Average</th>
			  </tr>
			</thead>
			<tbody>
			  {ratingsArray.map((user, index) => {
				return (
				  <tr key={index}>
					<td className="user_names" style={{width:'130'}}> {user.name}</td>
					
					{Array(days)
					  ?.fill(0)
					  ?.map((day, index) => {
						let ratingUserObj = user.ratings
						let ratingCommentObj = ratingUserObj?.find(
							(el) => el.date - 1 === index
						  );
						if (ratingCommentObj) {
						  return (
							<RatingBox
							  key={index}
							  index={index}
							  getAllRatings={getAllRatings}
							  ratingCommentObj={ratingCommentObj}
							/>
						  );
						} else {
						  let dateToSend = `${yearUse}-${
							months.indexOf(monthUse) + 1 <= 9
							  ? "0" + (months.indexOf(monthUse) + 1)
							  : months.indexOf(monthUse) + 1
						  }-${index + 1 <= 9 ? "0" + (index + 1) : index + 1}`;
						  return (
							<td key={index}>
							  {userDetails?.role === "CONTRIBUTOR" ||
							  new Date(dateToSend) > new Date() ? (
								<span
								  style={{
									padding: "1px",
									paddingLeft: "20px",
									paddingRight: "6px",
								  }}
								  className="input_dashboard"
								></span>
							  ) : (
								<>
								  <span
									style={{
									 
									  padding: "1px",
									  paddingLeft: "20px",
									  paddingRight: "6px",
									}}
									className="input_dashboard"
								  ></span>
						
								</>
							  )}
							</td>
						  );
						}
					  })}
					<td className="userAverage">
					  {user.monthlyAverage
						? Math.round((user.monthlyAverage) * 100) /
						  100
						: "NA"}
					</td>
				  </tr>
				);
			  })}
			</tbody>
		  </Table>

{/* <div class="calendar">
    <ul class="weekdays">
        <li>Chandan</li>
        <li>Manik</li>
        <li>Manav</li>
        <li>Mishba</li>
        <li>Mohit</li>
        <li>Rashid</li>
        <li>Chandan</li>
        <li>Manik</li>
        
        
    </ul>
    
    <ul class="days">
    
        <li class="out_of_range calendar-day">
            <div class="date day_cell"></div>
        </li>
        <li class="out_of_range calendar-day">
            <div class="date day_cell"></div>
        </li>            
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sun,</span> <span class="month">Mar</span> 1  
			<br/> <span className="rateing">5</span> 
			</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Mon,</span> <span class="month">Mar</span> 2</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Tue,</span> <span class="month">Mar</span> 3</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Wed,</span> <span class="month">Mar</span> 4</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Thu,</span> <span class="month">Mar</span> 5</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Fri,</span> <span class="month">Mar</span> 6</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sat,</span> <span class="month">Mar</span> 7</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sun,</span> <span class="month">Mar</span> 8</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Mon,</span> <span class="month">Mar</span> 9</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Tue,</span> <span class="month">Mar</span> 10</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Wed,</span> <span class="month">Mar</span> 11</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Thu,</span> <span class="month">Mar</span> 12</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Fri,</span> <span class="month">Mar</span> 13</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sat,</span> <span class="month">Mar</span> 14</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sun,</span> <span class="month">Mar</span> 15</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Mon,</span> <span class="month">Mar</span> 16</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Tue,</span> <span class="month">Mar</span> 17</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Wed,</span> <span class="month">Mar</span> 18</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Thu,</span> <span class="month">Mar</span> 19</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Fri,</span> <span class="month">Mar</span> 20</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sat,</span> <span class="month">Mar</span> 21</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sun,</span> <span class="month">Mar</span> 22</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Mon,</span> <span class="month">Mar</span> 23</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Tue,</span> <span class="month">Mar</span> 24</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Wed,</span> <span class="month">Mar</span> 25</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Thu,</span> <span class="month">Mar</span> 26</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Fri,</span> <span class="month">Mar</span> 27</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sat,</span> <span class="month">Mar</span> 28</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Sun,</span> <span class="month">Mar</span> 29</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Mon,</span> <span class="month">Mar</span> 30</div>
            <div class="show-info"></div>
        </li>
        <li class="calendar-day">
            <div class="date day_cell"><span class="day">Tue,</span> <span class="month">Mar</span> 31</div>
            <div class="show-info"></div>
        </li>
                
   
        <li class="out_of_range calendar-day">
            <div class="date day_cell"></div>
        </li>
        <li class="out_of_range calendar-day">
            <div class="date day_cell"></div>
        </li>
    </ul>
    
   
</div> */}
		</div>
  
		
		{loading ? <Loader /> : null}
		{toaster && (
		  <Toaster
			message={toasterMessage}
			show={toaster}
			close={() => showToaster(false)}
		  />
		)}
  
		<div>
		</div>
	  </div>
	):(
		<MyCalendar


		/>
	)
	}

	</div>

	

  )

 

 

 


}
