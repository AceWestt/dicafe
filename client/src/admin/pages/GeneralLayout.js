import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const GeneralLayout = () => {
  const { data, success } = useAxiosGet("/api/general");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [musicOnText, setMusicOnText] = useState({});
  const [musicOffText, setMusicOffText] = useState({});

  const [langSwitchText, setLangSwitchText] = useState({});

  const [checkoutText, setCheckoutText] = useState({});

  const [copyText, setCopyText] = useState({});

  const [phone, setPhone] = useState("");

  const [checkoutIcn, setCheckoutIcn] = useState(null);
  const [checkoutIcnOld, setCheckoutIcnOld] = useState(null);
  const [checkoutIcnTemp, setCheckoutIcnTemp] = useState(null);

  const [musicToggleIcn, setMusicToggleIcn] = useState(null);
  const [musicToggleIcnOld, setMusicToggleIcnOld] = useState(null);
  const [musicToggleIcnTemp, setMusicToggleIcnTemp] = useState(null);

  const [phoneIcn, setPhoneIcn] = useState(null);
  const [phoneIcnOld, setPhoneIcnOld] = useState(null);
  const [phoneIcnTemp, setPhoneIcnTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setMusicOnText(data?.music_toggle_text?.on);
    setMusicOffText(data?.music_toggle_text?.off);
    setLangSwitchText(data?.lang_switch);
    setPhone(data?.phone);
    setCheckoutText(data?.checkout_text);
    setCopyText(data?.copy);
    setCheckoutIcnOld(data?.checkout_icn);
    setMusicToggleIcnOld(data?.music_toggle_icn);
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
    const emptyfieldmsg = "?????????????????? ???????? ???? ?????????? ????????????!";
    if (!musicOnText.ru || !musicOnText.uz) {
      errorList.music_on = emptyfieldmsg;
    } else {
      errorList.music_on = undefined;
    }
    if (!musicOffText.ru || !musicOffText.uz) {
      errorList.music_off = emptyfieldmsg;
    } else {
      errorList.music_off = undefined;
    }
    if (!langSwitchText.ru || !langSwitchText.uz) {
      errorList.lang_switch = emptyfieldmsg;
    } else {
      errorList.lang_switch = undefined;
    }
    if (!checkoutText.ru || !checkoutText.uz) {
      errorList.checkout = emptyfieldmsg;
    } else {
      errorList.checkout = undefined;
    }
    if (!copyText.ru || !copyText.uz) {
      errorList.copy = emptyfieldmsg;
    } else {
      errorList.copy = undefined;
    }
    if (!phone) {
      errorList.phone = "?????????????????? ????????!";
    } else {
      errorList.phone = undefined;
    }
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append(
        "music_toggle_text",
        JSON.stringify({ on: musicOnText, off: musicOffText })
      );
      formData.append("lang_switch", JSON.stringify(langSwitchText));
      formData.append("checkout_text", JSON.stringify(checkoutText));
      formData.append("copy", JSON.stringify(copyText));
      formData.append("phone", phone);
      formData.append("checkout_icn", checkoutIcn);
      formData.append("music_toggle_icn", musicToggleIcn);
      formData.append("phone_icn", phoneIcn);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(`/api/general/${id}`, formData, config);
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
      title="???????????????????????????? ?????????? ??????????????????"
      disabled={!ready}
      hasErrors={hasErrors}
      onSubmit={handleSubmit}
    >
      <div className="group-label">????????????</div>
      <FormField
        type="multi-text"
        label="?????????? ???????????? ??????.:"
        value={musicOnText}
        onChange={{
          ru: (e) => setMusicOnText({ ...musicOnText, ru: e.target.value }),
          uz: (e) => setMusicOnText({ ...musicOnText, uz: e.target.value }),
        }}
        err={errors.music_on}
      />
      <FormField
        type="multi-text"
        label="?????????? ???????????? ????????.:"
        value={musicOffText}
        onChange={{
          ru: (e) => setMusicOffText({ ...musicOffText, ru: e.target.value }),
          uz: (e) => setMusicOffText({ ...musicOffText, uz: e.target.value }),
        }}
        err={errors.music_off}
      />
      <FormField
        label="???????????? ??????????????????????????:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setMusicToggleIcn,
            setMusicToggleIcnTemp,
            setErrors,
            errors,
            "music_icn"
          );
        }}
        err={errors.music_icn}
      />
      <IconImgSwapShow
        oldImg={musicToggleIcnOld}
        type="icon"
        newImg={musicToggleIcnTemp}
      />
      <div className="group-label">?????????????????????????? ??????????</div>
      <FormField
        type="multi-text"
        label="?????????? ??????????????????????????:"
        value={langSwitchText}
        onChange={{
          ru: (e) =>
            setLangSwitchText({ ...langSwitchText, ru: e.target.value }),
          uz: (e) =>
            setLangSwitchText({ ...langSwitchText, uz: e.target.value }),
        }}
        err={errors.lang_switch}
      />
      <div className="group-label">??????????????</div>
      <FormField
        type="text"
        label="??????????????:"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
        }}
        err={errors.phone}
      />
      <FormField
        label="???????????? ????????????????:"
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
      <div className="group-label">??????????????:</div>
      <FormField
        type="multi-text-area"
        label="T???????? ??????????????:"
        value={copyText}
        onChange={{
          ru: (e) => setCopyText({ ...copyText, ru: e.target.value }),
          uz: (e) => setCopyText({ ...copyText, uz: e.target.value }),
        }}
        err={errors.copy}
      />
      <div className="group-label">??????????????:</div>
      <FormField
        type="multi-text"
        label="T???????? ??????????????:"
        value={checkoutText}
        onChange={{
          ru: (e) => setCheckoutText({ ...checkoutText, ru: e.target.value }),
          uz: (e) => setCheckoutText({ ...checkoutText, uz: e.target.value }),
        }}
        err={errors.checkout}
      />
      <FormField
        label="???????????? ??????????????:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setCheckoutIcn,
            setCheckoutIcnTemp,
            setErrors,
            errors,
            "checkout_icn"
          );
        }}
        err={errors.checkout_icn}
      />
      <IconImgSwapShow
        oldImg={checkoutIcnOld}
        type="icon"
        newImg={checkoutIcnTemp}
      />
    </Form>
  );
};

export default GeneralLayout;
