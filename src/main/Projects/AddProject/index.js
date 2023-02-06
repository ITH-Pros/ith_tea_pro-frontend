import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/AuthProvider';
import Loader from '../../../components/Loader';
import Toaster from '../../../components/Toaster';
import { addNewProject, addNewUserDetail, getAllUsers } from '../../../services/user/api';
import './index.css'
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';


export default function AddProject(props) {

    const { userDetails } = useAuth()
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [userList, setUserList] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);



    const projectFormFields = { name: '', description: '', selectedManagers: [], projectCategories: [], selectAccessibleBy: [] }
    const [projectFormValue, setProjectFormValue] = useState(projectFormFields);


    useEffect(() => {
        getUsersList()
    }, [])

    const getUsersList = async function () {
        setLoading(true);
        try {
            const user = await getAllUsers();
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


    const updateRegisterFormValue = (e) => {
        setProjectFormValue({ ...projectFormValue, [e.target.name]: e.target.value })
    }

    function checkAllValuesPresent() {
        return Object.keys(projectFormValue).every(function (x) {
            if (['description', "selectAccessibleBy"].includes(x)) return true;
            console.log(x, projectFormValue[x])
            return projectFormValue[x];
        });
    }
    const submitProjectForm = async () => {
        setLoading(true);
        setValidated(true)
        try {
            console.log(checkAllValuesPresent())
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
        console.log("INNNNNN")
        if (event.key === 'Enter') {
            console.log("in add")
            event.preventDefault();
            projectFormValue.projectCategories.push(event.target.value)
            let projectCategories = new Set(projectFormValue.projectCategories)
            console.log(projectCategories)
            setNewCategory('')
            setProjectFormValue({ ...projectFormValue, projectCategories: [...projectCategories] })
        }
    }
    const removeProjectCategory = (category) => {
        console.log("In remove", category)
        setProjectFormValue({ ...projectFormValue, projectCategories: projectFormValue.projectCategories.filter(el => el !== category) })
    }

    const onAssignManagerChange = (users) => {
        setProjectFormValue({ ...projectFormValue, selectedManagers: users.map(el => el._id) })
    }
    const onAssignUserChange = (users) => {
        setProjectFormValue({ ...projectFormValue, selectAccessibleBy: users.map(el => el._id) })
    }

    return (
        <div className="addUserFrom">
            <Form noValidate validated={validated}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            onChange={updateRegisterFormValue}
                            value={projectFormValue.name}
                            name="name">
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Name is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} >
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" required type="text-area" placeholder="Description"
                            name="description"
                            onChange={updateRegisterFormValue}
                            value={projectFormValue.description}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Add Category</Form.Label>
                        <Form.Control type="text" placeholder="Category"
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={addProjectCategory}
                            value={newCategory}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <div >Categories :
                        {
                            projectFormValue.projectCategories.length ?
                                projectFormValue.projectCategories.map(el => <button className='ctgrybtn' onClick={() => removeProjectCategory(el)} key={el}>{el}</button>)
                                :
                                "  No Categories Added"
                        }
                    </div>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" >
                        <Form.Label>Assign Managers</Form.Label>
                        <Select 
                            isMulti
                            onChange={onAssignManagerChange}
                            getOptionLabel={(options) => options['name']}
                            getOptionValue={(options) => options['_id']}
                            options={userList}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Assign Users</Form.Label>
                        <Select
                            isMulti
                            onChange={onAssignUserChange}
                            getOptionLabel={(options) => options['name']}
                            getOptionValue={(options) => options['_id']}
                            options={userList}
                        />
                    </Form.Group>
                </Row>
                <div style={{ margin: '10px 500px' }}>
                    <Button className="btn-gradient-border btnDanger"
                        type="button"
                        onClick={submitProjectForm}
                    >Submit</Button>
                </div>
            </Form>
            {toaster && <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)} />
            }
            {loading ? <Loader /> : null}

        </div >



    )
};

