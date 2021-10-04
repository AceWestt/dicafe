import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const AboutPage = () => {
  const { data, success } = useAxiosGet("/api/aboutscreen");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [bigOwl, setBigOwl] = useState(null);
  const [bigOwlOld, setBigOwlOld] = useState(null);
  const [bigOwlTemp, setBigOwlTemp] = useState(null);

  const [smallOwl, setSmallOwl] = useState(null);
  const [smallOwlOld, setSmallOwlOld] = useState(null);
  const [smallOwlTemp, setSmallOwlTemp] = useState(null);

  const [title, setTitle] = useState({});
  const [backButtonTitle, setBackButtonTitle] = useState({});

  const [pointOneText, setPointOneText] = useState({});
  const [pointOneImg, setPointOneImg] = useState(null);
  const [pointOneImgOld, setPointOneImgOld] = useState(null);
  const [pointOneImgTemp, setPointOneImgTemp] = useState(null);

  const [pointTwoText, setPointTwoText] = useState({});
  const [pointTwoImg, setPointTwoImg] = useState(null);
  const [pointTwoImgOld, setPointTwoImgOld] = useState(null);
  const [pointTwoImgTemp, setPointTwoImgTemp] = useState(null);

  const [pointThreeText, setPointThreeText] = useState({});
  const [pointThreeImg, setPointThreeImg] = useState(null);
  const [pointThreeImgOld, setPointThreeImgOld] = useState(null);
  const [pointThreeImgTemp, setPointThreeImgTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setBigOwlOld(data?.big_owl);
    setSmallOwlOld(data?.small_owl);
    setTitle(data?.title);
    setBackButtonTitle(data?.back_button);
    setPointOneText({
      title: data?.point_one?.title,
      text: data?.point_one?.text,
    });
    setPointOneImgOld(data?.point_one?.img);
    setPointTwoText({
      title: data?.point_two?.title,
      text: data?.point_two?.text,
    });
    setPointTwoImgOld(data?.point_two?.img);
    setPointThreeText({
      title: data?.point_three?.title,
      text: data?.point_three?.text,
    });
    setPointThreeImgOld(data?.point_three?.img);
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
    if (!pointOneText.title?.ru || !pointOneText.title?.uz) {
      errorList.pointOneTitle = emptyfieldmsg;
    } else {
      errorList.pointOneTitle = undefined;
    }
    if (!pointOneText.text?.ru || !pointOneText.text?.uz) {
      errorList.pointOneText = emptyfieldmsg;
    } else {
      errorList.pointOneText = undefined;
    }
    if (!pointTwoText.title?.ru || !pointTwoText.title?.uz) {
      errorList.pointTwoTitle = emptyfieldmsg;
    } else {
      errorList.pointTwoTitle = undefined;
    }
    if (!pointTwoText.text?.ru || !pointTwoText.text?.uz) {
      errorList.pointTwoText = emptyfieldmsg;
    } else {
      errorList.pointTwoText = undefined;
    }
    if (!pointThreeText.title?.ru || !pointThreeText.title?.uz) {
      errorList.pointThreeTitle = emptyfieldmsg;
    } else {
      errorList.pointThreeTitle = undefined;
    }
    if (!pointThreeText.text?.ru || !pointThreeText.text?.uz) {
      errorList.pointThreeText = emptyfieldmsg;
    } else {
      errorList.pointThreeText = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("big_owl", bigOwl);
      formData.append("small_owl", smallOwl);
      formData.append("title", JSON.stringify(title));
      formData.append("back_button", JSON.stringify(backButtonTitle));
      formData.append("point_one_text", JSON.stringify(pointOneText));
      formData.append("point_one_img", pointOneImg);
      formData.append("point_two_text", JSON.stringify(pointTwoText));
      formData.append("point_two_img", pointTwoImg);
      formData.append("point_three_text", JSON.stringify(pointThreeText));
      formData.append("point_three_img", pointThreeImg);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(`/api/aboutscreen/${id}`, formData, config);
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
      title="Редактирование экрана «о нас»"
      onSubmit={handleSubmit}
      disabled={!ready}
      hasErrors={hasErrors}
    >
      <div className="group-label">Элементы фона</div>
      <FormField
        label="Имидж большой совы:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setBigOwl,
            setBigOwlTemp,
            setErrors,
            errors,
            "big_owl"
          );
        }}
        err={errors.big_owl}
      />
      <IconImgSwapShow oldImg={bigOwlOld} type="img" newImg={bigOwlTemp} />
      <FormField
        label="Имидж мал. совы:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setSmallOwl,
            setSmallOwlTemp,
            setErrors,
            errors,
            "small_owl"
          );
        }}
        err={errors.small_owl}
      />
      <IconImgSwapShow oldImg={smallOwlOld} type="img" newImg={smallOwlTemp} />
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
      <div className="group-label">Инфо-блок</div>
      <FormField
        label="Имидж 1 пункта:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setPointOneImg,
            setPointOneImgTemp,
            setErrors,
            errors,
            "point_one_img"
          );
        }}
        err={errors.point_one_img}
      />
      <IconImgSwapShow
        oldImg={pointOneImgOld}
        type="img"
        newImg={pointOneImgTemp}
      />
      <FormField
        type="multi-text"
        label="Заголовок 1 пункта:"
        value={pointOneText?.title}
        onChange={{
          ru: (e) =>
            setPointOneText({
              ...pointOneText,
              title: { ...pointOneText?.title, ru: e.target.value },
            }),
          uz: (e) =>
            setPointOneText({
              ...pointOneText,
              title: { ...pointOneText?.title, uz: e.target.value },
            }),
        }}
        err={errors.pointOneTitle}
      />
      <FormField
        type="multi-text-area"
        label="Текст 1 пункта:"
        value={pointOneText?.text}
        onChange={{
          ru: (e) =>
            setPointOneText({
              ...pointOneText,
              text: { ...pointOneText?.text, ru: e.target.value },
            }),
          uz: (e) =>
            setPointOneText({
              ...pointOneText,
              text: { ...pointOneText?.text, uz: e.target.value },
            }),
        }}
        err={errors.pointOneText}
      />
      <FormField
        label="Имидж 2 пункта:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setPointTwoImg,
            setPointTwoImgTemp,
            setErrors,
            errors,
            "point_two_img"
          );
        }}
        err={errors.point_two_img}
      />
      <IconImgSwapShow
        oldImg={pointTwoImgOld}
        type="img"
        newImg={pointTwoImgTemp}
      />
      <FormField
        type="multi-text"
        label="Заголовок 2 пункта:"
        value={pointTwoText?.title}
        onChange={{
          ru: (e) =>
            setPointTwoText({
              ...pointTwoText,
              title: { ...pointTwoText?.title, ru: e.target.value },
            }),
          uz: (e) =>
            setPointTwoText({
              ...pointTwoText,
              title: { ...pointTwoText?.title, uz: e.target.value },
            }),
        }}
      />
      <FormField
        type="multi-text-area"
        label="Текст 2 пункта:"
        value={pointTwoText?.text}
        onChange={{
          ru: (e) =>
            setPointTwoText({
              ...pointTwoText,
              text: { ...pointTwoText?.text, ru: e.target.value },
            }),
          uz: (e) =>
            setPointTwoText({
              ...pointTwoText,
              text: { ...pointTwoText?.text, uz: e.target.value },
            }),
        }}
      />
      <FormField
        label="Имидж 3 пункта:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setPointThreeImg,
            setPointThreeImgTemp,
            setErrors,
            errors,
            "point_three_img"
          );
        }}
        err={errors.point_three_img}
      />
      <IconImgSwapShow
        oldImg={pointThreeImgOld}
        type="img"
        newImg={pointThreeImgTemp}
      />
      <FormField
        type="multi-text"
        label="Заголовок 3 пункта:"
        value={pointThreeText?.title}
        onChange={{
          ru: (e) =>
            setPointThreeText({
              ...pointThreeText,
              title: { ...pointThreeText?.title, ru: e.target.value },
            }),
          uz: (e) =>
            setPointThreeText({
              ...pointThreeText,
              title: { ...pointThreeText?.title, uz: e.target.value },
            }),
        }}
      />
      <FormField
        type="multi-text-area"
        label="Текст 3 пункта:"
        value={pointThreeText?.text}
        onChange={{
          ru: (e) =>
            setPointThreeText({
              ...pointThreeText,
              text: { ...pointThreeText?.text, ru: e.target.value },
            }),
          uz: (e) =>
            setPointThreeText({
              ...pointThreeText,
              text: { ...pointThreeText?.text, uz: e.target.value },
            }),
        }}
      />
    </Form>
  );
};

export default AboutPage;
