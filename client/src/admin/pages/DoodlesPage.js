import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const DoodlesPage = () => {
  const { data, success } = useAxiosGet("/api/doodlescreen");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [title, setTitle] = useState({});
  const [backButtonTitle, setBackButtonTitle] = useState({});

  const [uploadButtonText, setUploadButtonText] = useState({});

  const [uploadButtonIcn, setUploadButtonIcn] = useState(null);
  const [uploadButtonIcnOld, setUploadButtonIcnOld] = useState(null);
  const [uploadButtonIcnTemp, setUploadButtonIcnTemp] = useState(null);

  const [doodlesImg, setDoodlesImg] = useState(null);
  const [doodlesImgOld, setDoodlesImgOld] = useState(null);
  const [doodlesImgTemp, setDoodlesImgTemp] = useState(null);

  const [doodlesImgMobile, setDoodlesImgMobile] = useState(null);
  const [doodlesImgMobileOld, setDoodlesImgMobileOld] = useState(null);
  const [doodlesImgMobileTemp, setDoodlesImgMobileTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setTitle(data?.title);
    setBackButtonTitle(data?.back_button);
    setUploadButtonText(data?.upload_button_text);
    setUploadButtonIcnOld(data?.upload_button_icn);
    setDoodlesImgOld(data?.doodles_img);
    setDoodlesImgMobileOld(data?.doodles_img_mobile);
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
    if (!uploadButtonText.ru || !uploadButtonText.uz) {
      errorList.upload_button_text = emptyfieldmsg;
    } else {
      errorList.upload_button_text = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("title", JSON.stringify(title));
      formData.append("back_button", JSON.stringify(backButtonTitle));
      formData.append("upload_button_text", JSON.stringify(uploadButtonText));
      formData.append("upload_button_icn", uploadButtonIcn);
      formData.append("doodles_img", doodlesImg);
      formData.append("doodles_img_mobile", doodlesImgMobile);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(
          `/api/doodlescreen/${id}`,
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
    }
  };
  return (
    <Form
      title="Редактирование экрана «ваши дудлы»"
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
      <div className="group-label">Основной блок</div>
      <FormField
        label="Иконка кнопки загрузки:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setUploadButtonIcn,
            setUploadButtonIcnTemp,
            setErrors,
            errors,
            "upload_button_icn"
          );
        }}
        err={errors.upload_button_icn}
      />
      <IconImgSwapShow
        oldImg={uploadButtonIcnOld}
        type="icon"
        newImg={uploadButtonIcnTemp}
      />
      <FormField
        type="multi-text"
        label="Надпись на кнопке загрузки:"
        value={uploadButtonText}
        onChange={{
          ru: (e) =>
            setUploadButtonText({ ...uploadButtonText, ru: e.target.value }),
          uz: (e) =>
            setUploadButtonText({ ...uploadButtonText, uz: e.target.value }),
        }}
        err={errors.upload_button_text}
      />
      <FormField
        label="Изображение дудлов (десктоп):"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setDoodlesImg,
            setDoodlesImgTemp,
            setErrors,
            errors,
            "doodles_img"
          );
        }}
        err={errors.doodles_img}
      />
      <IconImgSwapShow
        oldImg={doodlesImgOld}
        type="img"
        newImg={doodlesImgTemp}
      />
      <FormField
        label="Изображение дудлов (мобил):"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setDoodlesImgMobile,
            setDoodlesImgMobileTemp,
            setErrors,
            errors,
            "doodles_img_mobile"
          );
        }}
        err={errors.doodles_img_mobile}
      />
      <IconImgSwapShow
        oldImg={doodlesImgMobileOld}
        type="img"
        newImg={doodlesImgMobileTemp}
      />
    </Form>
  );
};

export default DoodlesPage;
