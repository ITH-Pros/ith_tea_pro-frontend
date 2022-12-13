import React from "react";
import Select from "react-select";

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: 14,
    background: "#cccccc1f",
    color: "#000",
    padding: "15px",
  }),
  control: (provided: any) => ({
    ...provided,
    boxShadow: "none",
    background: "#fff",

    height: "50px",

    borderRadius: "7px",

    color: "#000",
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#ccc",
  }),
  menu: (provided: any) => ({
    ...provided,

    borderRadius: "10px",
    boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
    top: "42px",
  }),

  multiValue: (provided: any) => ({
    ...provided,

    borderRadius: "25px",
    fontSize: 14,
  }),

  valueContainer: (provided: any) => ({
    ...provided,

    display: "flex",
    height: "45px",
  }),
};

type Props = {
  options: Array<any>;
  value: any;
  onChange: () => void;
  placeholder?: String;
};
const ReactSelect = (props: Props) => {
  return (
    <Select
      name="asset"
      options={props.options}
      className={`my-2 mb-4`}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default ReactSelect;
