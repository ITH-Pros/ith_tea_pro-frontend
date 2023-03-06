	import React from "react";
	import moment from "moment";
	import MyCalendar from "./weekCalendra";
	import { useState, useEffect } from "react";
	import { getRatings } from "../../services/user/api";
	import "./dashboard.css";
	import { MDBTooltip } from "mdb-react-ui-kit";
	// eslint-disable-next-line no-unused-vars
	import { BrowserRouter as Router, Link } from "react-router-dom";
	import Col from "react-bootstrap/Col";
	import Form from "react-bootstrap/Form";
	import Loader from "../../components/Loader";
	import { getAllUsers } from "../../services/user/api";
	import RatingBox from "../../components/ratingBox";
	import { useAuth } from "../../auth/AuthProvider";
	import Toaster from "../../components/Toaster";
	import {
	Row,
	Container,
	Nav,
	Dropdown,
	Card,
	Button,
	Badge,
	} from "react-bootstrap";
	import Avatar from "react-avatar";

	var month = moment().month();
	let currentYear = moment().year();
	export default function Dashboard(props) {
	const [usersArray, setTeamOptions] = useState([]);
	const [ratingsArray, setRatings] = useState([]);
	const [toasterMessage, setToasterMessage] = useState("");
	const [toaster, showToaster] = useState(false);
	const [loading, setLoading] = useState(false);

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
		const user = await getAllUsers();
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
		<div className="dashboard_camp">
		<div className="m-3 d-flex justify-content-center flex-column">
			<div>
			{userDetails?.role !== "USER" && (
				<Link to="/rating" params={{ params: true }}>
				{props.showBtn && (
					<div className="wrap">
					<button className="add-rating-button">
						<span>Add Rating</span>
					</button>
					</div>
				)}
				</Link>
			)}
			{/* <h5 className="text-center h5cls">
				<p style={{ marginRight: "10px", marginTop: "6px" }}>
				Ratings for
				</p>
				<Form.Group as={Col} md="1" controlId="select_month">
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
				<Form.Group as={Col} md="1" controlId="select_year">
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
			</div>
			{/* <table className="table fixed_header">
			<thead>
				<tr>
				<th>Name</th>
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
				{usersArray.map((user, index) => {
				let userRatingSum = 0;
				let userRatingCount = 0;

				return (
					<tr key={index}>
					<td className="user_names"> {user.name}</td>
					{Array(days)
						?.fill(0)
						?.map((day, index) => {
						let ratingUserObj = ratingsArray.find((el) => {
							return el._id === user._id;
						});
						let ratingCommentObj =
							ratingUserObj?.ratingsAndComment.find(
							(el) => el.date - 1 === index
							);
						if (ratingCommentObj) {
							userRatingSum += ratingCommentObj?.rating;
							userRatingCount += 1;
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
								{userDetails?.role === "USER" ||
								new Date(dateToSend) > new Date() ? (
								<span
									style={{ padding: "3px", paddingLeft: "18px" }}
									className="input_dashboard"
								></span>
								) : (
								<MDBTooltip
									tag="div"
									wrapperProps={{ href: "#" }}
									title={"click to Add Rating"}
								>
									<Link
									to={{ pathname: "/rating" }}
									state={{ userId: user._id, date: dateToSend }}
									>
									<span
										style={{
										cursor: "cell",
										padding: "3px",
										paddingLeft: "18px",
										}}
										className="input_dashboard"
									></span>
									</Link>
								</MDBTooltip>
								)}
							</td>
							);
						}
						})}
					<td className="userAverage">
						{userRatingCount
						? Math.round((userRatingSum / userRatingCount) * 100) /
							100
						: "NA"}
					</td>
					</tr>
				);
				})}
			</tbody>
			</table> */}
			{<MyCalendar />}
			</div>
		<Container>
			<Row>
			<Col lg={6} className="px-0">
				{" "}
				{props.showBtn && (
				<h1 className="h1-text">
					<i className="fa fa-home" aria-hidden="true"></i> My Projects
				</h1>
				)}
			</Col>
			<Col lg={6} id="nav-filter" className="px-0">
				<Nav className="justify-content-end" activeKey="/home">
				<Nav.Item>
					<Nav.Link href="">
					<Dropdown>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
						Filter <i className="fa fa-filter"></i>
						</Dropdown.Toggle>

						<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
							Another action
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
							Something else
						</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-1">
					<Dropdown>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
						Show All Project
						</Dropdown.Toggle>

						<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
							Favorite Projects
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
							Recent Projects
						</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-2">
					<Dropdown>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
						Sort : Custom
						</Dropdown.Toggle>

						<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Custom</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
							Alphabetical
						</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					</Nav.Link>
				</Nav.Item>
				</Nav>
			</Col>
			</Row>

			<Row className="row-bg">
			<Col lg={6}>
				<Card id="card-task">
				<Row className="d-flex justify-content-start">
					<Col lg={6} className="middle">
					<Avatar name="R" size={40} round="20px" />{" "}
					<h5 className="text-truncate">EMS (Web & Mobile)</h5>
					</Col>
					<Col lg={4} className="middle">
					<p className="text-truncate">ITH Technologies</p>
					</Col>
					<Col
					lg={2}
					className="text-end middle"
					style={{ justifyContent: "end" }}
					>
					<Button variant="light" size="sm">
						<i className="fa fa-star"></i>
					</Button>
					<Button variant="light" size="sm">
						<i className="fa fa-ellipsis-v"></i>
					</Button>
					</Col>
				</Row>
				</Card>
			</Col>

			<Col lg={6}>
				<Card id="card-task">
				<Row className="d-flex justify-content-start">
					<Col lg={6} className="middle">
					<Avatar name="R" size={40} round="20px" />{" "}
					<h5 className="text-truncate">EMS (Web & Mobile)</h5>
					</Col>
					<Col lg={4} className="middle">
					<p className="text-truncate">ITH Technologies</p>
					</Col>
					<Col
					lg={2}
					className="text-end middle"
					style={{ justifyContent: "end" }}
					>
					<Button variant="light" size="sm">
						<i className="fa fa-star"></i>
					</Button>
					<Button variant="light" size="sm">
						<i className="fa fa-ellipsis-v"></i>
					</Button>
					</Col>
				</Row>
				</Card>
			</Col>
			<Col lg={12} className="mt-3">
				<Card id="card-task">
				<Row className="d-flex justify-content-start">
					<Col lg={6} className="middle">
					<Avatar name="R" size={40} round="20px" />{" "}
					<h5 className="text-truncate">EMS (Web & Mobile)</h5>
					</Col>
					<Col lg={4} className="middle">
					<p className="text-truncate">ITH Technologies</p>
					</Col>
					<Col
					lg={2}
					className="text-end middle"
					style={{ justifyContent: "end" }}
					>
					<Button variant="light" size="sm">
						<i className="fa fa-star"></i>
					</Button>
					<Button variant="light" size="sm">
						<i className="fa fa-ellipsis-v"></i>
					</Button>
					</Col>
				</Row>
				</Card>
			</Col>
			</Row>

			<Row className="mt-3">
			<Col lg={6} style={{ paddingLeft: "0px" }}>
				<Row>
				<Col lg={6} className="left-add">
					<span>Work</span>

					<MDBTooltip title={"Start New Item"} variant="light" size="sm">
					<i className="fa fa-plus-circle"></i>
					</MDBTooltip>
					<Link to="./">Full Recap</Link>
				</Col>
				<Col lg={6} className="right-filter">
					<Dropdown>
					<Dropdown.Toggle variant="defult" id="dropdown-basic">
						Filter <i className="fa fa-filter"></i>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
						Another action
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
						Something else
						</Dropdown.Item>
					</Dropdown.Menu>
					</Dropdown>
					<Dropdown>
					<Dropdown.Toggle variant="defult" id="dropdown-basic">
						<i className="fa fa-ellipsis-v"></i>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
						Another action
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
						Something else
						</Dropdown.Item>
					</Dropdown.Menu>
					</Dropdown>
				</Col>
				</Row>
				<Row>
				<Col lg={12} className="mt-3">
					<Card id="card-task">
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="danger">TODAY</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>

					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="success">COMPLLETED</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="danger">TODAY</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="warning">PROGRESS</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					</Card>
				</Col>
				</Row>
			</Col>
			<Col lg={6} style={{ paddingRight: "0px" }}>
				<Row>
				<Col lg={6} className="left-add">
					<span>Pending Ratings</span>

					<MDBTooltip title={"Start New Item"} variant="light" size="sm">
					<i className="fa fa-plus-circle"></i>
					</MDBTooltip>
					<Link to="./">Full Recap</Link>
				</Col>
				<Col lg={6} className="right-filter">
					<Dropdown>
					<Dropdown.Toggle variant="defult" id="dropdown-basic">
						Filter <i className="fa fa-filter"></i>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
						Another action
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
						Something else
						</Dropdown.Item>
					</Dropdown.Menu>
					</Dropdown>
					<Dropdown>
					<Dropdown.Toggle variant="defult" id="dropdown-basic">
						<i className="fa fa-ellipsis-v"></i>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">
						Another action
						</Dropdown.Item>
						<Dropdown.Item href="#/action-3">
						Something else
						</Dropdown.Item>
					</Dropdown.Menu>
					</Dropdown>
				</Col>
				</Row>
				<Row>
				<Col lg={12} className="mt-3">
					<Card id="card-task">
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="danger">TODAY</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>

					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="success">COMPLLETED</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="danger">TODAY</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					<Row className="d-flex justify-content-start list_task">
						<Col lg={6} className="middle">
						<span
							style={{ fontSize: "20PX", marginRight: "10px" }}
							round="20px"
						>
							<i
							className="fa fa-check-circle"
							aria-hidden="true"
							></i>
						</span>
						<h5 className="text-truncate">
							And here's some amazing content. It's very engaging.
							right?
						</h5>
						</Col>
						<Col lg={4} className="middle">
						<small className="text-truncate">
							Due To <Badge bg="warning">PROGRESS</Badge>
						</small>
						</Col>
						<Col
						lg={2}
						className="text-end middle"
						style={{ justifyContent: "end" }}
						>
						<Button variant="light" size="sm">
							<i className="fa fa-star"></i>
						</Button>
						<Button variant="light" size="sm">
							<i className="fa fa-ellipsis-v"></i>
						</Button>
						</Col>
					</Row>
					</Card>
				</Col>
				</Row>
			</Col>
			</Row>
		</Container>

		{/* <div className="m-3 d-flex justify-content-center flex-column">
			<div>
			{userDetails?.role !== "USER" && (
				<Link to="/rating" params={{ params: true }}>
				{props.showBtn && (
					<div className="wrap">
					<button className="add-rating-button">
						<span>Add Rating</span>
					</button>
					</div>
				)}
				</Link>
			)} */}
			{/* <h5 className="text-center h5cls">
				<p style={{ marginRight: "10px", marginTop: "6px" }}>
				Ratings for
				</p>
				<Form.Group as={Col} md="1" controlId="select_month">
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
				<Form.Group as={Col} md="1" controlId="select_year">
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
			{/* </div> */}
			{/* <table className="table fixed_header">
			<thead>
				<tr>
				<th>Name</th>
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
				{usersArray.map((user, index) => {
				let userRatingSum = 0;
				let userRatingCount = 0;

				return (
					<tr key={index}>
					<td className="user_names"> {user.name}</td>
					{Array(days)
						?.fill(0)
						?.map((day, index) => {
						let ratingUserObj = ratingsArray.find((el) => {
							return el._id === user._id;
						});
						let ratingCommentObj =
							ratingUserObj?.ratingsAndComment.find(
							(el) => el.date - 1 === index
							);
						if (ratingCommentObj) {
							userRatingSum += ratingCommentObj?.rating;
							userRatingCount += 1;
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
								{userDetails?.role === "USER" ||
								new Date(dateToSend) > new Date() ? (
								<span
									style={{ padding: "3px", paddingLeft: "18px" }}
									className="input_dashboard"
								></span>
								) : (
								<MDBTooltip
									tag="div"
									wrapperProps={{ href: "#" }}
									title={"click to Add Rating"}
								>
									<Link
									to={{ pathname: "/rating" }}
									state={{ userId: user._id, date: dateToSend }}
									>
									<span
										style={{
										cursor: "cell",
										padding: "3px",
										paddingLeft: "18px",
										}}
										className="input_dashboard"
									></span>
									</Link>
								</MDBTooltip>
								)}
							</td>
							);
						}
						})}
					<td className="userAverage">
						{userRatingCount
						? Math.round((userRatingSum / userRatingCount) * 100) /
							100
						: "NA"}
					</td>
					</tr>
				);
				})}
			</tbody>
			</table> */}
			{/* {<MyCalendar />}
		</div> */}
		{loading ? <Loader /> : null}
		{toaster && (
			<Toaster
			message={toasterMessage}
			show={toaster}
			close={() => showToaster(false)}
			/>
		)}
		</div>
	);
	}
