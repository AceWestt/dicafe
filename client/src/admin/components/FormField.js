import React from "react";

const FormField = ({ className, label, type, onChange, value, err }) => {
  return (
    <div
      className={`form-control ${className ? className : ""} ${
        type === "file" ? "file" : ""
      } ${type === "multi-text" ? "multi-text" : ""} ${
        type === "multi-text-area" ? "multi-text" : ""
      }`}
    >
      <div className="field">
        <label>{label}</label>
        <Input type={type} onChange={onChange} value={value} />
      </div>
      {err && <p className="text-danger">{err}</p>}
    </div>
  );
};

export default FormField;

const Input = ({ type, onChange, value }) => {
  if (type === "file") {
    return <input type="file" onChange={onChange} />;
  }
  if (type === "multi-text") {
    return (
      <>
        <label className="multi">ru: </label>
        <input type="text" onChange={onChange?.ru} value={value?.ru || ""} />
        <label className="multi">uz: </label>
        <input type="text" onChange={onChange?.uz} value={value?.uz || ""} />
      </>
    );
  }
  if (type === "text-area") {
    return <textarea onChange={onchange}>{value}</textarea>;
  }
  if (type === "multi-text-area") {
    return (
      <>
        <label className="multi">ru: </label>
        <textarea onChange={onChange?.ru} value={value?.ru || ""} />
        <label className="multi">uz: </label>
        <textarea onChange={onChange?.uz} value={value?.uz || ""} />
      </>
    );
  }

  if (type === "number") {
    return (
      <input
        type="number"
        onChange={(e) => {
          if (["-", "e", "+"].includes(e.key)) {
            e.preventDefault();
          }
          onChange(e);
        }}
        value={value || 0}
      />
    );
  }
  return <input type="text" onChange={onChange} value={value || ""} />;
};
