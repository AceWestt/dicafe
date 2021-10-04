import React from "react";

const FormControl = (props) => {
  const { className, label, type, name, value, onChange } = props;
  return (
    <div className={className ? `form-control ${className}` : "form-control"}>
      {type !== "submit" && <label>{label}</label>}
      <Field type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default FormControl;

const Field = ({ type, name, value, onChange }) => {
  if (type === "submit") {
    return <button type="submit">{value}</button>;
  }
  return <input type={type} name={name} value={value} onChange={onChange} />;
};
