import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/AuthProvider';
import Loader from '../../../components/Loader';
import Toaster from '../../../components/Toaster';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  addNewProject,
    addNewUserDetail,
  getAllLeadsWithoutPagination,
  getAllProjects,
  getAllUserWithoutPagination,
  updateProjectForm,
} from "../../../services/user/api";
import './index.css'
import Select from 'react-select';
import { useNavigate , useLocation, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export default function AddProject(props) {

    // const { userDetails } = useAuth()
    const navigate = useNavigate();



    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [userList, setUserList] = useState([]);
    const [leadList, setLeadList] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [toaster, showToaster] = useState(false);
    const [assignedby, setAssignedByValue] = useState([]);
    const [managedby, setManagedByValue] = useState([]);
	const [projectList, setProjectListValue] = useState([]);
	const params = useParams()
  const setShowToaster = (param) => showToaster(param);

  const projectById = projectList.find((project) => project._id === params.projectId);
  console.log(projectById,'projectById')
  console.log(params,'params')

//   const projectDetails = location.state.project;
//   console.log(projectDetails,'locations')
	// Render the component using the projectDetails prop


    const projectFormFields = { name:  '', description: '', selectedManagers: [], projectCategories: [], selectAccessibleBy: [] }
    const [projectFormValue, setProjectFormValue] = useState(projectFormFields);


    useEffect(() => {
		getAndSetAllProjects();
        getUsersList();
        getLeadsList();
		// console.log("projectDetails", projectDetails);
    }, [])

	useEffect(() => {
		if (projectById) {
      setAssignedByValue(projectById.accessibleBy);
      setManagedByValue(projectById.managedBy)
		  setProjectFormValue({
        ...projectFormValue,
        name: projectById.name,
        description: projectById.description,
        selectedManagers: projectById.managedBy.map((el) => el._id),
        projectCategories: projectById.categories,
        selectAccessibleBy: projectById.accessibleBy.map((el) => el._id),
      });

		//   onAssignUserChange(projectById.accessibleBy);
		//   onAssignManagerChange(projectById.managedBy);
		//   patch selectedManagers and selectAccessibleBy with the values from projectById 
	
			
		  console.log(leadList,'leadList')
		}
	  }, [projectById]);


	const getAndSetAllProjects = async function () {
		//setloading(true);
		try {
		  const projects = await getAllProjects();
		  //setloading(false);
		  if (projects.error) {
			setToasterMessage(projects?.error?.message || "Something Went Wrong");
			setShowToaster(true);
		  } else {
			setProjectListValue(projects.data);

		  }
		} catch (error) {
		  setToasterMessage(error?.error?.message || "Something Went Wrong");
		  setShowToaster(true);
		  //setloading(false);
		  return error.message;
		}
	  };

	const handleUpdateProject = async (e) => {
		e.preventDefault();
        setLoading(true);
        setValidated(true)
        try {
            if (!checkAllValuesPresent()) {
                setLoading(false);
                return
            }
			const updatedProjectFormValue = {
				...projectFormValue,
				projectId: params.projectId,
			};
            const userRes = await updateProjectForm(updatedProjectFormValue);
            setLoading(false);
            if (userRes.error) {
                setToasterMessage(userRes?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setToasterMessage('Success');
                navigate('/project/all')

                // setShowToaster(true);
                // setProjectFormValue(projectFormFields)
                // setValidated(false)
            }
        } catch (error) {
            setToasterMessage(error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
	}


    const getUsersList = async function () {
        setLoading(true);
        try {
            const user = await getAllUserWithoutPagination();
            setLoading(false);

            if (user.error) {
                setToasterMessage(user?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setUserList(user.data);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    };
    const getLeadsList = async function () {
      setLoading(true);
      try {
        const lead = await getAllLeadsWithoutPagination();
        setLoading(false);

        if (lead.error) {
          setToasterMessage(lead?.error?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setLeadList(lead.data);


		  
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
    };


    const updateRegisterFormValue = (e) => {
        setProjectFormValue({ ...projectFormValue, [e.target.name]: e.target.value })
    }

    function checkAllValuesPresent() {
        return Object.keys(projectFormValue).every(function (x) {
            if (["selectAccessibleBy"].includes(x)) return true;
            return projectFormValue[x];
        });
    }
    const submitProjectForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidated(true)
		if (params.projectId) {
			handleUpdateProject(e);
			return;
		}
        try {
            if (!checkAllValuesPresent()) {
                setLoading(false);
                return
            }
            const userRes = await addNewProject(projectFormValue);
            setLoading(false);
            if (userRes.error) {
                setToasterMessage(userRes?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setToasterMessage('Success');
                navigate('/project/all')

                // setShowToaster(true);
                // setProjectFormValue(projectFormFields)
                // setValidated(false)
            }
        } catch (error) {
            setToasterMessage(error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    }
    const addProjectCategory = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log()
            projectFormValue.projectCategories.push(newCategory)
            let projectCategories = new Set(projectFormValue.projectCategories)
            setNewCategory('')
            setProjectFormValue({ ...projectFormValue, projectCategories: [...projectCategories] })
        }
    }
    const addProjectCategoryOnButtonClick = () => {
        if (!newCategory) {
            return
        }
        projectFormValue.projectCategories.push(newCategory)
        let projectCategories = new Set(projectFormValue.projectCategories)
        setNewCategory('')
        setProjectFormValue({ ...projectFormValue, projectCategories: [...projectCategories] })
    }
    const removeProjectCategory = (category) => {
        setProjectFormValue({ ...projectFormValue, projectCategories: projectFormValue.projectCategories.filter(el => el !== category) })
    }

  const onAssignManagerChange = (users) => {
    // setManagedByValue(...managedby, ...users);
    //   setTimeout(() => {
    //      console.log(managedby, users, "--------------------managed by");

    //   }, 1000);
    setManagedByValue(users);
      
    setProjectFormValue({ ...projectFormValue, selectedManagers: users.map(el => el._id) })
    setTimeout(() => {
      console.log(
        projectFormValue,users,
        "-----------------------------------projectFormValue"
      );
      
    },1000)
    }
  const onAssignUserChange = (users) => {
    
    setAssignedByValue(projectById.assignedby);

    setProjectFormValue({ ...projectFormValue, selectAccessibleBy: users.map(el => el._id) })

    }

    return (
      <div className="addUserFrom rightDashboard">
        {/* <h4 className='mb-5'>Add Project</h4> */}
        <Form noValidate className="addUserFormBorder" validated={validated}>
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={updateRegisterFormValue}
                value={projectFormValue.name}
                name="name"
                placeholder="Project Name"
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                Name is required !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Assign Leads</Form.Label>
              <Select
                isMulti
                onChange={onAssignManagerChange}
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                options={leadList}
                value={managedby}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Assign Users</Form.Label>
              <Select
                isMulti
                onChange={onAssignUserChange}
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                options={userList}
                value={assignedby}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                required
                type="text-area"
                placeholder="Description"
                name="description"
                onChange={updateRegisterFormValue}
                value={projectFormValue.description}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="5">
              <Form.Label>Add Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category"
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={addProjectCategory}
                value={newCategory}
                required={!projectFormValue.projectCategories.length}
              />
            </Form.Group>
            <Form.Group as={Col} md="1">
              <Button
                className="btn btn-gradient-border btnshort-modal"
                style={{ marginTop: "35px" }}
                type="button"
                onClick={addProjectCategoryOnButtonClick}
              >
                <i className="fa fa-plus" aria-hidden="true"></i>{" "}
              </Button>
            </Form.Group>
            <div className="mt-1">
              Categories:
              {projectFormValue.projectCategories.length
                ? projectFormValue.projectCategories.map((el) => (
                    <span className="ctgrybtn" key={el}>
                      {el}
                      <i
                        className="fa fa-times"
                        style={{ color: "red" }}
                        onClick={() => removeProjectCategory(el)}
                        aria-hidden="true"
                      ></i>
                    </span>
                  ))
                : "  No Categories Added"}
            </div>
          </Row>
          <div>
            {/* <Button className="btn-gradient-border btnDanger"
                type="button"
                onClick={submitProjectForm}
            >Submit</Button> */}
            {projectById && (
              <button onClick={submitProjectForm} className="btn-51">
                Update
              </button>
            )}
            {!projectById && (
              <button onClick={submitProjectForm} className="btn-51">
                Submit
              </button>
            )}
          </div>
        </Form>
        {toaster && (
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        )}
        {loading ? <Loader /> : null}
      </div>
    );
};

