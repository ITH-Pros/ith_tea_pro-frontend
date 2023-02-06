import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/AuthProvider';
import Loader from '../../../components/Loader';
import Toaster from '../../../components/Toaster';
import { addNewUserDetail, getAllUsers } from '../../../services/user/api';
import './index.css'
import Multiselect from 'react-bootstrap-multiselect'


export default function AddProject(props) {

    console.log("IIIIIIIIIIIIIIIIIINNNNNNNNNN ADDDDDDDD PROOOOOOOOJEEEECt")
    const { userDetails } = useAuth()
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [userList, setUserList] = useState([]);
    const [newCategory, setNewCategory] = useState([]);
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);



    const registerFromFields = { name: '', selectManagers: [], projectCategories: [] }
    const [registerFromValue, setRegisterFromValue] = useState(registerFromFields);


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
                setUserList([...user.data]);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    };


    const updateRegisterFormValue = (e) => {
        setRegisterFromValue({ ...registerFromValue, [e.target.name]: e.target.value })
    }

    // function checkAllValuesPresent() {
    //     return Object.keys(registerFromValue).every(function (x) {
    //         if (x === 'showPassword') return true;
    //         console.log(x, registerFromValue[x])
    //         return registerFromValue[x];
    //     });
    // }
    // const submitRegisterFrom = async () => {
    //     setLoading(true);
    //     setValidated(true)
    //     try {
    //         console.log(checkAllValuesPresent())
    //         if (!checkAllValuesPresent()) {
    //             setLoading(false);
    //             return
    //         }
    //         const userRes = await addNewUserDetail(registerFromValue);
    //         setLoading(false);
    //         if (userRes.error) {
    //             setToasterMessage(userRes?.message || 'Something Went Wrong');
    //             setShowToaster(true);
    //             return
    //         } else {
    //             setToasterMessage('Success');
    //             setShowToaster(true);
    //             setRegisterFromValue(registerFromFields)
    //             setValidated(false)
    //         }
    //     } catch (error) {
    //         setToasterMessage(error?.message || 'Something Went Wrong');
    //         setShowToaster(true);
    //         setLoading(false);
    //         return error.message;
    //     }
    // }
    const addProjectCategory = (event) => {
        if (event.key === 'Enter') {
            console.log("in add")
            event.preventDefault();
            let projectCategories = registerFromValue.projectCategories.push(event.target.value)
            setNewCategory('')
            setRegisterFromValue({ ...registerFromValue, projectCategories: [...new Set(projectCategories)] })
        }
    }
    const removeProjectCategory = (category) => {
        console.log("In remove", category)
        setRegisterFromValue({ ...registerFromValue, projectCategories: registerFromValue.projectCategories.filter(el => el !== category) })
    }
    const onAssignManagerChange = (users) => {
        console.log("In onAssignManagerChange", registerFromValue.selectManagers, users[0].value)
        let selectManagers = registerFromValue.selectManagers
        selectManagers = selectManagers.push(users[0].value)
        console.log("In onAssignManagerChange", selectManagers)
        setRegisterFromValue({ ...registerFromValue, selectManagers: [...new Set(selectManagers)] })
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
                            value={registerFromValue.name}
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
                        // value={commentFormValue}
                        // onChange={(e) => { setCommentValue(e.target.value) }} 
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Add Category</Form.Label>
                        <Form.Control required type="text" placeholder="Category"
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={addProjectCategory}
                            value={newCategory}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    {/* <Form.Group > */}
                    {/* <div></div> */}
                    <div >Categories :
                        {
                            registerFromValue.projectCategories.length ?
                                registerFromValue.projectCategories.map(el => <button className='ctgrybtn' onClick={() => removeProjectCategory(el)} key={el}>{el}</button>)
                                :
                                "  No Categories Added"
                        }
                    </div>
                    {/* </Form.Group> */}
                </Row>
                {/* <form> */}
                {/* <select multiple={true} value={registerFromValue.selectManagers} onChange={(e) => { onAssignManagerChange(e.target.selectedOptions) }}>
                    <option value="">Assign Manager</option>
                    {userList.map((user) => (
                        <option value={user._id} key={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select> */}
                {/* </form> */}
                <Multiselect data={userList} multiple />
                {/* <Form.Group as={Col} md="4" > */}
                {/* <Form.Label>Assign Manager</Form.Label> */}

                {/* <Form.Control
                        required
                        as="select"
                        type="select"
                        multiple
                        onChange={onAssignManagerChange}
                        value={registerFromValue.selectManagers}
                    >
                        <option value="">Assign Manager</option>
                        {userList.map((user) => (
                            <option value={user._id} key={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </Form.Control> */}
                {/* </Form.Group> */}

                <div style={{ margin: '10px 500px' }}>
                    <Button className="btn-gradient-border btnDanger"
                        type="button"
                    // onClick={submitRegisterFrom}
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

