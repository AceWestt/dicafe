import React from "react";

const Form = ({
  title,
  error,
  clearBtn,
  cancelBtn,
  onSubmit,
  onClear,
  onCancel,
  children,
  disabled,
  hasErrors,
  side,
}) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-header">
        <p>{title}</p>
        <p className="error">{error}</p>
      </div>
      <div className={side ? "form-body has-side" : "form-body"}>
        {children}
      </div>
      <div className="form-footer">
        <button
          className={`btn ${disabled ? "btn-disabled" : "btn-success"} ${
            hasErrors ? "btn-error" : ""
          }`}
          type="submit"
          disabled={disabled}
        >
          Сохранить
        </button>
        {clearBtn && (
          <button className="btn btn-danger" onClick={onClear}>
            Очистить
          </button>
        )}
        {cancelBtn && (
          <button className="btn btn-warning" onClick={onCancel}>
            Отменить
          </button>
        )}
      </div>
      {side && <div className="form-side">{side}</div>}
    </form>
  );
};

export default Form;
