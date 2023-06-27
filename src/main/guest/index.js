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
  changeGuestStatus,
  deleteGuestApi,
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
    // console.log(guest);
    setSelectedProjects(guest);
    setShowProjectModal(true);
  };

  const guestStatus = async () => {
    let dataToSend = {
        userId: selectedGuest._id,
        active: !selectedGuest.active,
    };
    setLoading(true);
    try {
        const guest = await getGuestApi(dataToSend);
        if (guest.error) {
            setToasterMessage(guest?.message || "Something Went Wrong");
            showToaster(true);
        } else {
               setToasterMessage(guest?.message || "Guest Updated Successfully");
            showToaster(true);
        }
    } catch (error) {
        setToasterMessage(error?.message || "Something Went Wrong");
        showToaster(true);
    }
    setLoading(false);
    }



   

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
      project: guest.projects.map((project) => project._id),
    });
    setShowAddEditModal(true);
  };

  const handleDeleteGuest = async () => {
    localStorage.setItem("setPageDetails" , JSON.stringify(pageDetails));

    let dataToSend = {
        userId: selectedGuest._id,
    };
    setLoading(true);
    try {
        const guest = await deleteGuestApi(dataToSend);
        if (guest.error) {
            setToasterMessage(guest?.message || "Something Went Wrong");
            showToaster(true);
        } else {
            setToasterMessage("Guest Deleted Successfully");
            showToaster(true);
            localStorage.getItem("setPageDetails");
            setPageDetails(JSON.parse(localStorage.getItem("setPageDetails")));
            localStorage.removeItem("setPageDetails");
            // onClose();
            getGuests(pageDetails);
            setShowDeleteConfirmation(false);
        }
    } catch (error) {
        setToasterMessage(error?.message || "Something Went Wrong");
        showToaster(true);
    }
    setLoading(false);
    
  };

  const handleToggleActive = async (guest) => {
    localStorage.setItem("setPageDetails" , JSON.stringify(pageDetails))
  
    // Update the active status of the selected guest
    let dataToSend = {
      userId: guest._id,
      active: !guest.guestCredentials[0].isActive,
    }
    setLoading(true);
    try {
      const guest = await changeGuestStatus(dataToSend);
      if (guest.error) {
        setToasterMessage(guest?.message || "Something Went Wrong");
        showToaster(true);
        setLoading(false);
      } else {
        setToasterMessage("Guest Updated Successfully");
        setPageDetails(JSON.parse(localStorage.getItem("setPageDetails")));
        localStorage.removeItem("setPageDetails");
        showToaster(true);
        getGuests(pageDetails);
        setLoading(false);
      }
    }
    catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
      setLoading(false);
    }

  };

  // Render the table rows
  const tableRows = guests?.map((guest, index) => {
    const serialNumber = (pageDetails.currentPage - 1) * pageDetails.rowsPerPage + index + 1;
    return (
      <tr key={guest._id}>
        <td>{serialNumber}</td>
        <td>{guest.name}</td>
        <td>{guest.email}</td>
        <td>
          <i
            className="fa fa-eye"
            onClick={() => handleShowProjectModal(guest?.projects)}
            style={{ marginLeft: "4px", cursor: "pointer" }}
          ></i>
        </td>
        <td>
          <Switch
            onChange={() => handleToggleActive(guest)}
            checked={guest?.guestCredentials[0]?.isActive}
          />
  
          <i
            className="fa fa-trash"
            onClick={() => handleDeleteConfirmation(guest)}
            style={{ marginLeft: "4px" }}
          ></i>
          {/* <i
            className="fa fa-edit"
            onClick={() => handleEditModal(guest)}
            style={{ marginLeft: "4px" }}
          ></i> */}
        </td>
      </tr>
    );
  });
  

  const handleSubmit = () => {
    // console.log(formData);

    if (!formData.name || !formData.email || !formData.project.length) {
      alert("Please fill all the fields");
      return;
    }

    let dataToSend = {
      name: formData.name,
      email: formData.email,
      projectIds: formData.project,
      role: "GUEST"
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

    let options = {
      currentPage: 1,
      rowsPerPage: 10,
    };
    
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
        getGuests(options);
        setShowAddEditModal(false);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
    }
    setLoading(false);
  };

  const setLocalStorage = () => {
    localStorage.setItem("setPageDetails" , JSON.stringify(pageDetails));
  }

  const getLocalStorage = () => {
    setPageDetails(JSON.parse(localStorage.getItem("setPageDetails")));
    localStorage.removeItem("setPageDetails");
  }

  // Edit guest API integration
  const editGuest = async (dataToSend) => {

    setLocalStorage();

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
            // console.log(project?.error);
          
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

  const addGuestButton = () => {
    setSelectedGuest(null);
    setShowAddEditModal(true) ;
     getProjectList()
  }


  return (
    <div className="rightDashboard" style={{ marginTop: "7%" }}>
      <h1 className="h1-text">
        <i className="fa fa-users" aria-hidden="true"></i>Guest
        <div className="projects-button">
          <Button
            variant="primary"
            size="md"
            onClick={() =>{ addGuestButton() }}
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
            <th>Sr. No.</th>
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
              
            <td colSpan="5">
              <div className="pagination">
                <CustomPagination
                  getGuests={getGuests}
                  pageDetails={pageDetails}
                  setPageDetails={setPageDetails}
                />
              </div>
            </td>
      
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
        <Modal.Body>Are you sure you want to delete {selectedGuest?.name}</Modal.Body>
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
        {selectedProjects.length > 0 ? (
  <ul>
    {selectedProjects.map((project) => (
      <li key={project?._id}>{project?.name}</li>
    ))}
  </ul>
) : (
  <p>Project is not assigned</p>
)}


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
