import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Button,
  Modal,
  Offcanvas,
  Col,
  Form,
  Row,
  ToastContainer,
} from "react-bootstrap";
import Switch from "react-switch";
import Select from "react-select";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import {
  addGuestApi,
  editGuestApi,
  getAllProjects,
  getGuestApi,
} from "../../services/user/api";

export default function Guest({}) {
  const [pageDetails, setPageDetails] = useState({
    currentPage: 1,
    rowsPerPage: 10,
    totalPages: 1,
  });

  const [projects, setProjects] = useState([
  ]);

  const [guests, setGuests] = useState([
    // Add more guest objects as needed
  ]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    onInit();
  }, []);

  function onInit() {
    let options = {
      currentPage: 1,
      rowsPerPage: 10,
    };
    getGuests(options);
  }

  const handleShowProjectModal = (guest) => {
    setSelectedProjects(guest.project);
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: [],
  });

  const handleDeleteConfirmation = (guest) => {
    setSelectedGuest(guest);
    setShowDeleteConfirmation(true);
  };

  const handleEditModal = (guest) => {
    setSelectedGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      project: guest.project.map((project) => project._id),
    });
    setShowAddEditModal(true);
  };

  const handleDeleteGuest = () => {
    // Delete the selected guest from the guests state array
    setGuests((prevGuests) =>
      prevGuests.filter((guest) => guest._id !== selectedGuest._id)
    );

    // Close the delete confirmation modal
    setShowDeleteConfirmation(false);
  };

  const handleToggleActive = (guest) => {
    // Update the active status of the selected guest
    setGuests((prevGuests) =>
      prevGuests.map((g) => {
        if (g._id === guest._id) {
          return { ...g, active: !g.active };
        }
        return g;
      })
    );
  };

  // Render the table rows
  const tableRows = guests?.map((guest) => (
    <tr key={guest._id}>
      <td>{guest._id}</td>
      <td>{guest.name}</td>
      <td>{guest.email}</td>
      <td>
        <i
          className="fa fa-eye"
          onClick={() => handleShowProjectModal(guest)}
          style={{ marginLeft: "4px", cursor: "pointer" }}
        ></i>
      </td>
      <td>
        <Switch
          onChange={() => handleToggleActive(guest)}
          checked={guest.active}
        />

        <i
          className="fa fa-trash"
          onClick={() => handleDeleteConfirmation(guest)}
          style={{ marginLeft: "4px" }}
        ></i>
        <i
          className="fa fa-edit"
          onClick={() => handleEditModal(guest)}
          style={{ marginLeft: "4px" }}
        ></i>
      </td>
    </tr>
  ));

  const handleSubmit = () => {
    console.log(formData);

    if (!formData.name || !formData.email || !formData.project.length) {
      alert("Please fill all the fields");
      return;
    }

    let dataToSend = {
      name: formData.name,
      email: formData.email,
      projectIds: formData.project,
    };

    // Add or edit the guest based on the selectedGuest value
    if (selectedGuest) {
      // Editing an existing guest
      editGuest(dataToSend);
    } else {
      // Adding a new guest
      addGuest(dataToSend);
    }
    // Close the Add/Edit modal and reset the form fields
    setShowAddEditModal(false);
    setFormData({
      name: "",
      email: "",
      project: [],
    });
  };

  //  add guest API integration
  const addGuest = async (dataToSend) => {
    setLoading(true);
    try {
      const guest = await addGuestApi(dataToSend);
      if (guest.error) {
        setToasterMessage(guest?.message || "Something Went Wrong");
        showToaster(true);
      } else {
        setToasterMessage("Guest Added Successfully");
        showToaster(true);
        // onClose();
        getGuests();
        setShowAddEditModal(false);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
    }
    setLoading(false);
  };

  // Edit guest API integration
  const editGuest = async (dataToSend) => {
    setLoading(true);
    try {
      const guest = await editGuestApi(dataToSend);
      if (guest.error) {
        setToasterMessage(guest?.message || "Something Went Wrong");
        showToaster(true);
      } else {
        setToasterMessage("Guest Updated Successfully");
        showToaster(true);
        setShowAddEditModal(false);

        // onClose();
        getGuests();
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
    }
    setLoading(false);
  };

  const getGuests = async (options) => {
    let params = {
      limit: options?.rowsPerPage,
      currentPage: options?.currentPage,
    };
    setLoading(true);
    try {
      const guest = await getGuestApi(params);
      if (guest.error) {
        setToasterMessage(guest?.message || "Something Went Wrong");
        showToaster(true);
      } else {
        setGuests(guest?.data?.users);
        let totalPages = Math.ceil(
          guest?.data?.totalCount / options?.rowsPerPage
        );
        setPageDetails({
          currentPage: Math.min(options?.currentPage, totalPages),
          rowsPerPage: options?.rowsPerPage,
          totalPages,
        });
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
    }
    setLoading(false);
  };

  const getProjectList = async() => {
    setLoading(true);
    try {
        const project = await getAllProjects();
        if (project.error) {
            console.log(project?.error);
          
        } else {
            setProjects(project?.data);
        }
    } catch (error) {
        setToasterMessage(error?.message || "Something Went Wrong");
        showToaster(true);
    }
    setLoading(false);
}

  const CustomPagination = (props) => {
    const { getGuests, setPageDetails, pageDetails } = props;

    const numberOfRowsArray = [10, 20, 30, 40, 50];
    const handleOnChange = (e) => {
      let pageNumber = parseInt(e.target.value);
      if (pageNumber < 1 || pageNumber > pageDetails?.totalPages) {
        return;
      }
      if (pageDetails.currentPage === pageNumber) {
        return;
      }
      let dataToSave = { ...pageDetails, [e.target.name]: pageNumber };
      setPageDetails(dataToSave);
      getGuests(dataToSave);
    };

    const onChangeRowsPerPage = (e) => {
      let dataToSave = {
        ...pageDetails,
        [e.target.name]: parseInt(e.target.value),
        currentPage: 1,
      };

      setPageDetails(dataToSave);
      getGuests(dataToSave);
    };
    const changePageNumber = (value) => {
      if (
        pageDetails.currentPage + value <= 0 ||
        pageDetails.currentPage + value > pageDetails?.totalPages
      ) {
        return;
      }
      let dataToSave = {
        ...pageDetails,
        currentPage: pageDetails?.currentPage + value,
      };
      setPageDetails(dataToSave);
      getGuests(dataToSave);
    };

    return (
      <div className="pagination ">
        <i
          className="fa fa-angle-left pagination-arrow left-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(-1)}
        ></i>
        <input
          className="pagination-input"
          type="number"
          value={pageDetails?.currentPage}
          name="currentPage"
          onChange={(e) => handleOnChange(e)}
        />
        <span className="pagination-input">/</span>
        <span className="pagination-input"> {pageDetails?.totalPages}</span>
        <i
          className="fa fa-angle-right pagination-arrow right-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(1)}
        ></i>
        <span className="page-per-view"> Per Page View : </span>
        <select
          className="pagination-select"
          onChange={onChangeRowsPerPage}
          name="rowsPerPage"
          value={pageDetails?.rowsPerPage}
        >
          {numberOfRowsArray.map((ele, index) => {
            return (
              <option key={ele} value={ele}>
                {ele}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="rightDashboard" style={{ marginTop: "7%" }}>
      <h1 className="h1-text">
        <i className="fa fa-users" aria-hidden="true"></i>Guest
        <div className="projects-button">
          <Button
            variant="primary"
            size="md"
            onClick={() =>{ setShowAddEditModal(true) ; getProjectList()}}
          >
            <span
              className="fa fa-user-plus"
              title="Add Guest"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></span>
            Add Guest
          </Button>
        </div>
      </h1>
      <table>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Project</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
     
        <tfoot>
          <tr>
          { guests?.length === 0 && (
              <td colSpan="5" className="text-center"> 
                No data found
                </td>
                )}
                { guests?.length >= 10 && (
            <td colSpan="5">
              <div className="pagination">
                <CustomPagination
                  getGuests={getGuests}
                  pageDetails={pageDetails}
                  setPageDetails={setPageDetails}
                />
              </div>
            </td>
            )}
          </tr>
        </tfoot>
      </table>

      {/* Confirmation modal for delete */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this guest?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            No
          </Button>
          <Button variant="primary" onClick={handleDeleteGuest}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit modal */}
      <Offcanvas
        show={showAddEditModal}
        style={{ width: "600px" }}
        onHide={() => setShowAddEditModal(false)}
        placement="end"
        className="my-offcanvas"
      >
        <Offcanvas.Header closeButton className="my-offcanvas-header">
          <Offcanvas.Title className="my-offcanvas-title">
            {selectedGuest ? "Edit Guest" : "Add Guest"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="my-offcanvas-body">
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="name">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Guest name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="project">
                  <Form.Label>Project:</Form.Label>
                  <Select
                    isMulti
                    options={projects.map((project) => ({
                      value: project._id,
                      label: project.name,
                    }))}
                    value={formData.project.map((projectId) => ({
                      value: projectId,
                      label: projects.find(
                        (project) => project._id === projectId
                      ).name,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedProjectIds = selectedOptions.map(
                        (option) => option.value
                      );
                      setFormData({ ...formData, project: selectedProjectIds });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <div className="form-footer pull-right">
            <Button
              className="mr-3"
              variant="secondary"
              onClick={() => setShowAddEditModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showProjectModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {selectedProjects.map((project) => (
              <li key={project._id}>{project.name}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProjectModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? <Loader /> : null}
      {toaster && (
        <ToastContainer position="top-end" className="p-3">
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        </ToastContainer>
      )}
    </div>
  );
}
