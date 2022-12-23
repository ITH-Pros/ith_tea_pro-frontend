import React from 'react';
import { useEffect, useState } from 'react';
import { getAllUsers, editUserDetail } from '../../services/user/api';
import { toast } from "react-toastify";
import './teams.css'
import Loader from '../../loader/loader';

export default function Teams() {

    const [loading, setLoading] = useState(false);
    const [usersList, setUsersListValue] = useState([]);

    useEffect(() => {
        onInit();
    }, []);

    function onInit() {
        getAndSetAllUsers();
    }
    const getAndSetAllUsers = async function () {
        setLoading(true);
        try {
            const projects = await getAllUsers();
            setLoading(false);
            if (projects.error) {
                toast.error(projects.error.message, {
                    position: toast.POSITION.TOP_CENTER,
                    className: "toast-message",
                });
            } else {
                setUsersListValue(projects.data);
            }
        } catch (error) {
            setLoading(false);
            return error.message;
        }
    };

    const editUserDetailHandle = async function (userDetail) {
        setLoading(true);
        try {
            let dataToSend = {
                userId: userDetail._id
            }
            const projects = await editUserDetail(dataToSend);
            setLoading(false);
            if (projects.error) {
                toast.error(projects.error.message, {
                    position: toast.POSITION.TOP_CENTER,
                    className: "toast-message",
                });
            } else {
                setUsersListValue(projects.data);
            }
        } catch (error) {
            setLoading(false);
            return error.message;
        }
    };
    
    return (
        <>
            <h1 className="h1-text">
                <i className="fa fa-users" aria-hidden="true"></i>Team Members
            </h1>
            <div className="container-team">
                {
                    usersList.map((user) => {
                        return (
                            <div key={user._id} className="box">
                                <div className="top-bar"></div>
                                <div className="top">
                                    <i className="fa fa-check-circle" id="heart-btn-1" style={{ cursor: "grab" }} aria-hidden="true" onClick={() => editUserDetailHandle(user)}></i>
                                    <label className="heart" ></label>
                                </div>
                                <div className="content">
                                    <img src="https://images.pexels.com/photos/2570145/pexels-photo-2570145.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" />
                                    <strong>David Warner</strong>
                                    <p>thewarner@gmail.com</p>
                                </div>
                                <div className="btn">
                                    <a href="#"><i className="fa fa-check" aria-hidden="true"></i>Assign</a>
                                    <a href="#"><i className="fa fa-check" aria-hidden="true"></i>Rating</a>
                                </div>
                            </div>

                        )
                    })
                }


            </div>

        </>
    )
};

