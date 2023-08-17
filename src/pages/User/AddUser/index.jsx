import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Loader from '@components/Shared/Loader/index';
import { CONSTANTS } from '../../../constants';
import { addNewUserDetail } from '@services/user/api';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "./index.css";
import { useMutation } from 'react-query';

export default function AddUser(props) {
  const navigate = useNavigate();
  const rolesList = CONSTANTS.ROLES;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required !!'),
    email: Yup.string().email('Invalid email format').required('Email is required !!'),
    role: Yup.string().required('Role is required !!')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: rolesList[0]
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  const mutation = useMutation(addNewUserDetail, {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.info(data?.message || 'Something Went Wrong');
      } else {
        toast.dismiss();
        toast.info('Success');
        formik.resetForm();
        navigate('/team');
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.error?.message || 'Something Went Wrong');
    }
  });

  return (
    <div className="addUserFrom rightDashboard" style={{ marginTop: '7%' }}>
      <div className="backButton">
        <Link to="/team">
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button>
        </Link>
      </div>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Row className="mb-3 mt-3">
          <Form.Group as={Col} md="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Name"
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Email id"
              isInvalid={formik.touched.email && formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4">
            <Form.Label>Role</Form.Label>
            <Form.Control
              required
              as="select"
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              isInvalid={formik.touched.role && formik.errors.role}
            >
              <option value="" disabled>
                Select Role
              </option>
              {rolesList?.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formik.errors.role}</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <div className="text-right">
          <Button className="btn-gradient-border btnDanger " type="submit">
            Submit
          </Button>
        </div>
      </Form>
      {formik.isSubmitting ? <Loader /> : null}
    </div>
  );
}
