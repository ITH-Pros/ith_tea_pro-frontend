/* eslint-disable default-case */
import React from "react";
import { useState, useEffect } from "react";
import "react-date-picker/dist/DatePicker.css";
import "./rating.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { addRating } from "../../services/user/api";
import Dashboard from "../Dashboard/dashboard";
// import { toast } from "react-toastify";
import Loader from "../../loader/loader";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import { getAllUsers } from "../../services/user/api";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut"
});

const swirl = cssTransition({
  enter: "swirl-in-fwd",
  exit: "swirl-out-bck"
});


// let teamOptions = [];
export default function Rating(props) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onInit() {
    getUsersList();
  }
  let today = new Date();
  let patchDateValue = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("Add");
  const [teamOptions, setTeamOptions] = useState([]);
  const [team, setTeam] = useState("");
  const [date, setDate] = useState(patchDateValue);
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [validated, setValidated] = useState(false);

  console.log(patchDateValue)
  if (!team && location && location.state && location.state.userId) {
    setTeam(location.state.userId)
  }
  if (location && location.state && location.state.date && location.state.date !== date) {
    setDate(location.state.date)
    location.state.date = '';
  }

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const onchangeTeam = (e) => {
    setTeam(e.target.value);
  };

  const handleChangeDate = (date) => {
    setDate(date.target.value);
  };

  const onChangeOfComments = (e) => {
    setComments(e)
    console.log("sejfnweiornwoerfnaifjbsij sijdbfisjbfisa ihsvfgiw", e)
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log("iiiiiiiiiiiiiii", comments, date)
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    // console.log()

    if (!team || !date || !rating || !comments) {
      return;
    } else {
      let dataToSend = {
        userId: team,
        date: date?.split("-")[2],
        year: date?.split("-")[0],
        month: date?.split("-")[1],
        rating: rating,
        comment: comments,
        // taggedUsers: tags,
      };

      console.log(
        dataToSend,
        "==========================================================================data"
      );
      addRatingFunc(dataToSend);
    }
  };

  const getUsersList = async function () {

    setLoading(true);
    try {

      const user = await getAllUsers();
      setLoading(false);

      if (user.error) {

        toast.dark(" 👋," + user?.error?.message, {
          transition: swirl
        });

      } else {
        toast.dark(" 👋, User List Fetched Succesfully ", {
          transition: swirl
        });


        setTeamOptions(user.data);
        console.log(user.data);
      }
    } catch (error) {
      toast.dark(" 👋," + error?.message, {
        transition: swirl
      });
      setLoading(false);
      return error.message;
    }
  };

  async function addRatingFunc(data) {
    setLoading(true);
    try {
      const rating = await addRating(data);
      setLoading(false);
      if (rating.error) {
        toast.dark(" 👋, " + rating?.error?.message, {
          transition: swirl
        });

      } else {

        toast.dark(" 👋, Submitted succesfully ", {
          transition: swirl
        });
        navigate('/')
        console.log(rating.data);
      }
    }
    catch (error) {

      toast.dark(" 👋," + error?.message, {
        transition: swirl
      });
      setLoading(false);
      console.log(error?.message)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "Add":
        return (
          <div className="dv-50-rating">
            <Form noValidate validated={validated}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" >
                  <Form.Label>Select User</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    name="select_team"
                    onChange={onchangeTeam}
                    value={team}
                  >
                    <option value="">Select User</option>
                    {teamOptions.map((module) => (
                      <option value={module._id} key={module._id}>
                        {module.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    User name is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="rating_date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="rating_date"
                    placeholder="Rating  date"
                    onChange={handleChangeDate}
                    value={date}
                  />
                  <Form.Control.Feedback type="invalid">
                    Date is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Rating"
                    value={rating}
                    onChange={handleRatingChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                  <Form.Control.Feedback type="invalid">
                    Rating is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Row>

              {/* <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="comment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    type="text-area"
                    placeholder="Comment"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Comment is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Row> */}
              <Row className="mb-3">
                <Form.Label>Comment</Form.Label>
                <FroalaEditorComponent tag='textarea' onModelChange={onChangeOfComments} />
              </Row>


              <Button
                className="btn-gradient-border"
                type="submit"
                onClick={handleSubmit}
              >
                Submit form
              </Button>
            </Form>
          </div>
        );

      case "View":
        return (
          <div>
            <div className=" dv-40 ">
              <div className={`d-flex`}>
                <div className="d-flex justify-content-center flex-grow-1">
                  <div className="d-flex justify-content-center mt-4"></div>
                  <Dashboard showBtn={false} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return
    }
  };

  return (
    <div className="m-3">
      <div className="d-flex w-100 justify-content-around ">
        <div
          onClick={() => handleViewChange("Add")}
          className={`p-3 border-top border-start border-end w-50  text-center rounded ${currentView === "Add" ? "text-white bg-active" : "border-bottom "
            }`}
          style={{ cursor: "pointer" }}
        >
          Add Rating
        </div>
        <div
          onClick={() => handleViewChange("View")}
          className={`p-3 border-top border-start border-end w-50 text-center rounded ${currentView === "View" ? "text-white bg-active" : "border-bottom "
            }`}
          style={{ cursor: "pointer" }}
        >
          View{" "}
        </div>
        {loading ? <Loader /> : null}
      </div>
      {renderCurrentView()}
      <ToastContainer transition={bounce} />
    </div>
  );
}
