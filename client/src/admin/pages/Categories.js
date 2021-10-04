import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";
import { GoPencil } from "react-icons/go";
import { GoTrashcan } from "react-icons/go";

const Categories = () => {
  const [formTitle, setFormTitle] = useState("Добавление новой категории");

  const { data, success } = useAxiosGet("/api/products/cats");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [title, setTitle] = useState({});

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
  }, [success]);

  useEffect(() => {
    if (getObjLentgh(errors) === 0) {
      setHasErrors(false);
    } else {
      setHasErrors(true);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorList = errors;
    const emptyfieldmsg = "Заполните поле на обоих языках!";
    if (!title.ru || !title.uz) {
      errorList.title = emptyfieldmsg;
    } else {
      errorList.title = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("title", JSON.stringify(title));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      if (id) {
        try {
          const res = await axios.put(
            `/api/products/cats/${id}`,
            formData,
            config
          );
          if (res.data.status === "success") {
            setReady(true);
            window.location.reload();
          }
        } catch (error) {
          console.error(error);
          console.log(error.response);
        }
      } else {
        try {
          const res = await axios.post(`/api/products/cats/`, formData, config);
          if (res.data.status === "success") {
            setReady(true);
            window.location.reload();
          }
        } catch (error) {
          console.error(error);
          console.log(error.response);
        }
      }
    }
  };

  const handleDelete = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const res = await axios.delete(`/api/products/cats/${id}`, config);
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      console.log(error.response);
    }
  };

  return (
    <Form
      title={formTitle}
      disabled={!ready}
      hasErrors={hasErrors}
      onSubmit={handleSubmit}
      side={
        <Side
          data={data}
          setId={setId}
          setTitle={setTitle}
          setFormTitle={setFormTitle}
          handleDelete={handleDelete}
        />
      }
    >
      <FormField
        type="multi-text"
        label="Название категории:"
        value={title}
        onChange={{
          ru: (e) => setTitle({ ...title, ru: e.target.value }),
          uz: (e) => setTitle({ ...title, uz: e.target.value }),
        }}
        err={errors.title}
      />
    </Form>
  );
};

export default Categories;

const Side = ({ data, setId, setTitle, handleDelete, setFormTitle }) => {
  return (
    <div className="parent-container">
      <div className="container">
        {data?.map((c) => {
          return (
            <div className="item" key={c._id}>
              <div className="item-title">
                <span>RU: {c.title.ru}</span>
                <span>UZ: {c.title.uz}</span>
              </div>
              <div className="item-control">
                <span
                  className="edit"
                  onClick={() => {
                    setId(c._id);
                    setTitle(c.title);
                    setFormTitle("Редактирование категории");
                  }}
                >
                  <GoPencil className="icon" />
                </span>
                <span
                  className="delete"
                  onClick={() => {
                    handleDelete(c._id);
                  }}
                >
                  <GoTrashcan className="icon" />
                </span>
              </div>
            </div>
          );
        })}
        <div
          className="item add"
          onClick={() => {
            setId(null);
            setTitle({});
          }}
        >
          Новая категория
        </div>
      </div>
    </div>
  );
};
