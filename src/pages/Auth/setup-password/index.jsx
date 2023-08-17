/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { setPasswordApi, verifyTokenApi } from "@services/user/api";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import "./index.css";
import { toast } from "react-toastify";

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function PasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data: verifyTokenData, isError: isVerifyTokenError } = useQuery(
    ["verifyToken", token],
    () => verifyTokenApi({ token }),
    {
      onSuccess: (data) => {
        if (!data.error) {
          toast.info(data.message);
        }
      },
    }
  );

  const setPasswordMutation = useMutation(setPasswordApi, {
    onSuccess: (data) => {
      if (!data.error) {
        toast.info(data.message);
        localStorage.setItem("passwordReset", true);
        navigate("/login");
      }
    },
    onError: (error) => {
      toast.info(error.message);
    },
  });

  const handleSubmit = (values) => {
    setPasswordMutation.mutate({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  useEffect(() => {
    if (isVerifyTokenError) {
      navigate("/login");
    }
  }, [isVerifyTokenError, navigate]);

  return (
    <div className="set-password">
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
        email: verifyTokenData?.data?.email || "",
      }}
      validationSchema={PasswordSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange }) => (
          <Form className="password-form">
            <h4>Set Password</h4>
            <div className="hed-pass">
              <h4>Email : {values.email}</h4>
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </div>

            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                className="submit-button"
                type="submit"
                disabled={!values.password || !values.confirmPassword}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PasswordForm;
