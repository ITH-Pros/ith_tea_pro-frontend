import React from "react";

const FormInput = (props: any) => {
  return (
    <input
      className="form-control my-3"
      type="text"
      placeholder={props.placeholder}
    />
  );
};

export default FormInput;
