import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/AuthProvider';
import Loader from '../../../components/Loader';
import Toaster from '../../../components/Toaster';
import { addNewUserDetail } from '../../../services/user/api';
import './index.css'

export default function AddUser(props) {
    const { userDetails } = useAuth()
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);



    const rolesList = ["USER", "SUPER_ADMIN", "ADMIN", "LEAD"]
    const registerFromFields = { name: '', email: '', employeeId: '', department: '', wings: '', designation: '', role: rolesList[0], showPassword: false, password: '' }
    const [registerFromValue, setRegisterFromValue] = useState(registerFromFields);

    const updateRegisterFormValue = (e) => {
        setRegisterFromValue({ ...registerFromValue, [e.target.name]: e.target.value })
    }
    const showHidePassword = () => {
        setRegisterFromValue({ ...registerFromValue, showPassword: !registerFromValue.showPassword })
    }

    function checkAllValuesPresent() {
        return Object.keys(registerFromValue).every(function (x) {
            if (x === 'showPassword') return true;
            console.log(x, registerFromValue[x])
            return registerFromValue[x];
        });
    }
    const submitRegisterFrom = async () => {
        setLoading(true);
        setValidated(true)
        try {
            console.log(checkAllValuesPresent())
            if (!checkAllValuesPresent()) {
                setLoading(false);
                return
            }
            const userRes = await addNewUserDetail(registerFromValue);
            setLoading(false);
            if (userRes.error) {
                setToasterMessage(userRes?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setToasterMessage('Success');
                setShowToaster(true);
                setRegisterFromValue(registerFromFields)
                setValidated(false)
            }
        } catch (error) {
            setToasterMessage(error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
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
                    <Form.Group as={Col} md="6">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            onChange={updateRegisterFormValue}
                            value={registerFromValue.email}
                            name='email'>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Email is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={registerFromValue.employeeId}
                            name='employeeId'
                            onChange={updateRegisterFormValue}
                        />

                        <Form.Control.Feedback type="invalid">
                            Employee ID is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="6" >
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name='department'
                            onChange={updateRegisterFormValue}
                            value={registerFromValue.department}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Employee ID is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" >
                        <Form.Label>Wing</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            // placeholder="Wing"
                            name='wings'
                            value={registerFromValue.wings}
                            onChange={updateRegisterFormValue}
                        />
                        <Form.Control.Feedback type="invalid">
                            Employee ID is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="6" >
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name='designation'
                            onChange={updateRegisterFormValue}
                            value={registerFromValue.designation}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Employee ID is required !!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3 " >
                    <Form.Group as={Col} md="3"  >
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            type="select"
                            name='role'
                            onChange={updateRegisterFormValue}
                            value={registerFromValue.role}
                        >
                            <option value="" disabled>Select Role</option>
                            {rolesList?.map((role) => (
                                <option value={role} key={role}>
                                    {role}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} md="3" className="field" >
                        <div >
                            <span className="fa fa-lock"></span>
                            <input autoComplete={registerFromValue.password} type={registerFromValue.showPassword ? "text" : "password"} name='password' placeholder="Password" onChange={updateRegisterFormValue} >
                            </input>
                            <span> <i style={{ position: 'relative', cursor: 'pointer' }} name='showPassword' onClick={showHidePassword} className={registerFromValue.showPassword ? "fa fa-eye-slash" : "fa fa-eye"} ></i>
                            </span>
                        </div>
                    </Form.Group>


                </Row>

                <div style={{ margin: '10px 500px' }}>
                    <Button className="btn-gradient-border btnDanger"
                        type="button"
                        onClick={submitRegisterFrom}
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

