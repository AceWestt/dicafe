import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const OrderPage = () => {
  const { data, success } = useAxiosGet("/api/orderscreen");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [title, setTitle] = useState({});
  const [backButtonTitle, setBackButtonTitle] = useState({});

  const [crownImg, setCrownImg] = useState(null);
  const [crownImgOld, setCrownImgOld] = useState(null);
  const [crownImgTemp, setCrownImgTemp] = useState(null);

  const [skaterImg, setSkaterImg] = useState(null);
  const [skaterImgOld, setSkaterImgOld] = useState(null);
  const [skaterImgTemp, setSkaterImgTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setTitle(data?.title);
    setBackButtonTitle(data?.back_button);
    setCrownImgOld(data?.crown);
    setSkaterImgOld(data?.skater);
  }, [data, success]);

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
    if (!backButtonTitle.ru || !backButtonTitle.uz) {
      errorList.backButtonTitle = emptyfieldmsg;
    } else {
      errorList.backButtonTitle = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("title", JSON.stringify(title));
      formData.append("back_button", JSON.stringify(backButtonTitle));
      formData.append("crown", crownImg);
      formData.append("skater", skaterImg);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(`/api/orderscreen/${id}`, formData, config);
        if (res.data.status === "success") {
          setReady(true);
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        console.log(error.response);
      }
    }
  };

  return (
    <Form
      title="Редактирование экрана «заказать»"
      disabled={!ready}
      hasErrors={hasErrors}
      onSubmit={handleSubmit}
    >
      <div className="group-label">Шапка экрана</div>
      <FormField
        type="multi-text"
        label="Заголовок экрана:"
        value={title}
        onChange={{
          ru: (e) => setTitle({ ...title, ru: e.target.value }),
          uz: (e) => setTitle({ ...title, uz: e.target.value }),
        }}
        err={errors.title}
      />
      <FormField
        type="multi-text"
        label="Надпись на кнопке вернуться:"
        value={backButtonTitle}
        onChange={{
          ru: (e) =>
            setBackButtonTitle({ ...backButtonTitle, ru: e.target.value }),
          uz: (e) =>
            setBackButtonTitle({ ...backButtonTitle, uz: e.target.value }),
        }}
        err={errors.backButtonTitle}
      />
      <div className="group-label">Элементы фона</div>
      <FormField
        label="Изображение короны:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setCrownImg,
            setCrownImgTemp,
            setErrors,
            errors,
            "crown"
          );
        }}
        err={errors.crown}
      />
      <IconImgSwapShow oldImg={crownImgOld} type="img" newImg={crownImgTemp} />
      <FormField
        label="Изображение скейтера:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setSkaterImg,
            setSkaterImgTemp,
            setErrors,
            errors,
            "skater"
          );
        }}
        err={errors.skater}
      />
      <IconImgSwapShow
        oldImg={skaterImgOld}
        type="img"
        newImg={skaterImgTemp}
      />
    </Form>
  );
};

export default OrderPage;
