import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import IconImgSwapShow from "../components/IconImgSwapShow";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { handleImgUpload } from "../utils/handleFunctions";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";

const MainPage = () => {
  const { data, success } = useAxiosGet("/api/mainscreen");

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [satellite, setSatellite] = useState(null);
  const [satelliteOld, setSatelliteOld] = useState(null);
  const [satelliteTemp, setSatelliteTemp] = useState(null);

  const [lamp, setLamp] = useState(null);
  const [lampOld, setLampOld] = useState(null);
  const [lampTemp, setLampTemp] = useState(null);

  const [cloudBig, setCloudBig] = useState(null);
  const [cloudBigOld, setCloudBigOld] = useState(null);
  const [cloudBigTemp, setCloudBigTemp] = useState(null);

  const [cloudSmall, setCloudSmall] = useState(null);
  const [cloudSmallOld, setCloudSmallOld] = useState(null);
  const [cloudSmallTemp, setCloudSmallTemp] = useState(null);

  const [flower, setFlower] = useState(null);
  const [flowerOld, setFlowerOld] = useState(null);
  const [flowerTemp, setFlowerTemp] = useState(null);

  const [seamonster, setSeamonster] = useState(null);
  const [seamonsterOld, setSeamonsterOld] = useState(null);
  const [seamonsterTemp, setSeamonsterTemp] = useState(null);

  const [houses, setHouses] = useState(null);
  const [housesOld, setHousesOld] = useState(null);
  const [housesTemp, setHousesTemp] = useState(null);

  const [snicker, setSnicker] = useState(null);
  const [snickerOld, setSnickerOld] = useState(null);
  const [snickerTemp, setSnickerTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(success);
    setId(data?._id);
    setSatelliteOld(data?.sattelite);
    setLampOld(data?.lamp);
    setCloudBigOld(data?.cloud_big);
    setCloudSmallOld(data?.cloud_small);
    setFlowerOld(data?.flower);
    setSeamonsterOld(data?.seamonster);
    setHousesOld(data?.houses);
    setSnickerOld(data?.snicker);
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
    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("sattelite", satellite);
      formData.append("lamp", lamp);
      formData.append("cloud_big", cloudBig);
      formData.append("cloud_small", cloudSmall);
      formData.append("flower", flower);
      formData.append("seamonster", seamonster);
      formData.append("houses", houses);
      formData.append("snicker", snicker);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const res = await axios.put(`/api/mainscreen/${id}`, formData, config);
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
      title={"Редактирование главного экрана"}
      onSubmit={handleSubmit}
      disabled={!ready}
      hasErrors={hasErrors}
    >
      <div className="group-label">Элементы фона</div>
      <FormField
        label="Изображение спутника:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setSatellite,
            setSatelliteTemp,
            setErrors,
            errors,
            "satellite"
          );
        }}
        err={errors.satellite}
      />
      <IconImgSwapShow
        oldImg={satelliteOld}
        type="img"
        newImg={satelliteTemp}
      />
      <FormField
        label="Изображение олака 1:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setCloudBig,
            setCloudBigTemp,
            setErrors,
            errors,
            "cloud_big"
          );
        }}
        err={errors.cloud_big}
      />
      <IconImgSwapShow oldImg={cloudBigOld} type="img" newImg={cloudBigTemp} />
      <FormField
        label="Изображение олака 2:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setCloudSmall,
            setCloudSmallTemp,
            setErrors,
            errors,
            "cloud_small"
          );
        }}
        err={errors.cloud_small}
      />
      <IconImgSwapShow
        oldImg={cloudSmallOld}
        type="img"
        newImg={cloudSmallTemp}
      />
      <FormField
        label="Изображение лампы:"
        type="file"
        onChange={(e) => {
          handleImgUpload(e, setLamp, setLampTemp, setErrors, errors, "lamp");
        }}
        err={errors.lamp}
      />
      <IconImgSwapShow oldImg={lampOld} type="img" newImg={lampTemp} />
      <FormField
        label="Изображение цветка:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setFlower,
            setFlowerTemp,
            setErrors,
            errors,
            "flower"
          );
        }}
        err={errors.flower}
      />
      <IconImgSwapShow oldImg={flowerOld} type="img" newImg={flowerTemp} />
      <FormField
        label="Изображение монстра:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setSeamonster,
            setSeamonsterTemp,
            setErrors,
            errors,
            "seamonster"
          );
        }}
        err={errors.seamonster}
      />
      <IconImgSwapShow
        oldImg={seamonsterOld}
        type="img"
        newImg={seamonsterTemp}
      />
      <FormField
        label="Изображение домиков:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setHouses,
            setHousesTemp,
            setErrors,
            errors,
            "houses"
          );
        }}
        err={errors.houses}
      />
      <IconImgSwapShow oldImg={housesOld} type="img" newImg={housesTemp} />
      <FormField
        label="Изображение кросовка:"
        type="file"
        onChange={(e) => {
          handleImgUpload(
            e,
            setSnicker,
            setSnickerTemp,
            setErrors,
            errors,
            "snicker"
          );
        }}
        err={errors.snicker}
      />
      <IconImgSwapShow oldImg={snickerOld} type="img" newImg={snickerTemp} />
    </Form>
  );
};

export default MainPage;
