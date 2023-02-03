import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthProvider';
import Loader from '../../../components/Loader';
import Toaster from '../../../components/Toaster';
import { getUserDetailsByUserId } from '../../../services/user/api';
import './index.css'

export default function ViewUser(props) {
    const { userId } = useParams();


    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);

    useEffect(() => {
        getUserDetails();
    }, [])

    const getUserDetails = async () => {
        // setLoading(true);
        try {
            console.log("userId----", userId)
            let params = {
                userId
            }
            const userDetails = await getUserDetailsByUserId({ params });
            setLoading(false);
            if (userDetails.error) {
                setToasterMessage(userDetails?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                console.log(userDetails)
                setUserDetails(userDetails.data)
            }
        } catch (error) {
            setToasterMessage(error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    }
    return (
        <></>
    )
};

