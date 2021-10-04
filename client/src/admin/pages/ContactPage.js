import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const ContactPage = () => {
  const { data, success } = useAxiosGet("/api/contactscreen");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [title, setTitle] = useState({});
  const [backButtonTitle, setBackButtonTitle] = useState({});

  const [address, setAddress] = useState({});

  const [addressIcn, setAddressIcn] = useState(null);
  const [addressIcnOld, setAddressIcnOld] = useState(null);
  const [addressIcnTemp, setAddressIcnTemp] = useState(null);

  const [addressIcnMobile, setAddressIcnMobile] = useState(null);
  const [addressIcnMobileOld, setAddressIcnMobileOld] = useState(null);
  const [addressIcnMobileTemp, setAddressIcnMobileTemp] = useState(null);

  const [phone, setPhone] = useState("");

  const [phoneIcn, setPhoneIcn] = useState(null);
  const [phoneIcnOld, setPhoneIcnOld] = useState(null);
  const [phoneIcnTemp, setPhoneIcnTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setTitle(data?.title);
    setBackButtonTitle(data?.back_button);
    setAddress(data?.address);
    setAddressIcnOld(data?.address_icn);
    setAddressIcnMobileOld(data?.address_icn_mobile);
    setPhone(data?.phone);
    setPhoneIcnOld(data?.phone_icn);
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
    if (!address.ru || !address.uz) {
      errorList.address = emptyfieldmsg;
    } else {
      errorList.address = undefined;
    }
    if (!phone) {
      errorList.phone = "Заполните поле!";
    } else {
      errorList.phone = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("title", JSON.stringify(title));
      formData.append("back_button", JSON.stringify(backButtonTitle));
      formData.append("address", JSON.stringify(address));
      formData.append("address_icn", addressIcn);
      formData.append("address_icn_mobile", addressIcnMobile);
      formData.append("phone", phone);
      formData.append("phone_icn", phoneIcn);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(
          `/api/contactscreen/${id}`,
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
      title="Редактирование экрана «контакты»"
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
        type="multi-text-area"
        label="Адрес:"
        value={address}
        onChange={{
          ru: (e) => setAddress({ ...address, ru: e.target.value }),
          uz: (e) => setAddress({ ...address, uz: e.target.value }),
        }}
        err={errors.address}
      />
      <FormField
        label="Иконка адреса (десктоп):"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setAddressIcn,
            setAddressIcnTemp,
            setErrors,
            errors,
            "address_icn"
          );
        }}
        err={errors.address_icn}
      />
      <IconImgSwapShow
        oldImg={addressIcnOld}
        type="icon"
        newImg={addressIcnTemp}
      />
      <FormField
        label="Иконка адреса (мобил):"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setAddressIcnMobile,
            setAddressIcnMobileTemp,
            setErrors,
            errors,
            "address_icn_mobile"
          );
        }}
        err={errors.address_icn_mobile}
      />
      <IconImgSwapShow
        oldImg={addressIcnMobileOld}
        type="icon"
        newImg={addressIcnMobileTemp}
      />
      <FormField
        type="text"
        label="Телефон:"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
        }}
        err={errors.phone}
      />
      <FormField
        label="Иконка телефона:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setPhoneIcn,
            setPhoneIcnTemp,
            setErrors,
            errors,
            "phone_icn"
          );
        }}
        err={errors.phone_icn}
      />
      <IconImgSwapShow oldImg={phoneIcnOld} type="icon" newImg={phoneIcnTemp} />
    </Form>
  );
};

export default ContactPage;
