import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import FormField from "../components/FormField";
import { useAxiosGet } from "../../hooks/useAxiosGet";
import { getObjLentgh } from "../utils/utils";
import axios from "axios";
import { GoPencil } from "react-icons/go";
import { GoTrashcan } from "react-icons/go";
import { handleImgUpload } from "../utils/handleFunctions";
import IconImgSwapShow from "../components/IconImgSwapShow";

const Products = () => {
  const [formTitle, setFormTitle] = useState("Добавление нового продукта");

  const { data: catData, success: catSuccess } =
    useAxiosGet("/api/products/cats");
  const [catId, setCatId] = useState(null);
  const { data, success } = useAxiosGet(`/api/products/products/${catId}`);

  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const [title, setTitle] = useState({});
  const [subtitle, setSubtitle] = useState({});
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const [img, setImg] = useState(null);
  const [imgOld, setImgOld] = useState(null);
  const [imgTemp, setImgTemp] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (catSuccess && success) {
      setReady(true);
    } else {
      setReady(false);
    }
    if (catData && catData.length > 0) {
      setCatId(catData[0]._id);
    } else {
      setCatId(null);
    }
  }, [catData, catSuccess, success]);

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
    if (!subtitle.ru || !subtitle.uz) {
      errorList.subtitle = emptyfieldmsg;
    } else {
      errorList.subtitle = undefined;
    }
    if (!id && !img) {
      errorList.img = "Загрузите изображение!";
    } else {
      errorList.img = undefined;
    }

    setErrors({ ...errors, ...errorList });
    if (getObjLentgh(errorList) === 0) {
      setReady(false);
      const formData = new FormData();
      formData.append("title", JSON.stringify(title));
      formData.append("subtitle", JSON.stringify(subtitle));
      formData.append("amount", amount);
      formData.append("price", price);
      formData.append("img", img);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      if (id) {
        try {
          const res = await axios.put(
            `/api/products/products/${id}`,
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
          const res = await axios.post(
            `/api/products/products/${catId}`,
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
      const res = await axios.delete(`/api/products/products/${id}`, config);
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
          catId={catId}
          setCatId={setCatId}
          categories={catData}
          data={data}
          setId={setId}
          setTitle={setTitle}
          setSubtitle={setSubtitle}
          setAmount={setAmount}
          setPrice={setPrice}
          setImg={setImg}
          setImgOld={setImgOld}
          setImgTemp={setImgTemp}
          handleDelete={handleDelete}
          setFormTitle={setFormTitle}
        />
      }
    >
      <FormField
        type="multi-text"
        label="Название продукта:"
        value={title}
        onChange={{
          ru: (e) => setTitle({ ...title, ru: e.target.value }),
          uz: (e) => setTitle({ ...title, uz: e.target.value }),
        }}
        err={errors.title}
      />
      <FormField
        type="multi-text"
        label="Кр. описание продукта:"
        value={subtitle}
        onChange={{
          ru: (e) => setSubtitle({ ...subtitle, ru: e.target.value }),
          uz: (e) => setSubtitle({ ...subtitle, uz: e.target.value }),
        }}
        err={errors.subtitle}
      />
      <FormField
        type="number"
        label="Количество продукта:"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        err={errors.amount}
      />
      <FormField
        type="number"
        label="Цена продукта:"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        err={errors.price}
      />
      <FormField
        label="Изображение продукта:"
        type="file"
        onChange={(e) => {
          handleImgUpload(e, setImg, setImgTemp, setErrors, errors, "img");
        }}
        err={errors.img}
      />
      <IconImgSwapShow oldImg={imgOld} type="img" newImg={imgTemp} />
    </Form>
  );
};

export default Products;

const Side = ({
  catId,
  setCatId,
  categories,
  data,
  setId,
  setTitle,
  setSubtitle,
  setAmount,
  setPrice,
  setImg,
  setImgOld,
  setImgTemp,
  handleDelete,
  setFormTitle,
}) => {
  const handleClear = () => {
    setId(null);
    setTitle({});
    setSubtitle({});
    setAmount(0);
    setPrice(0);
    setImg(null);
    setImgOld(null);
    setImgTemp(null);
    setFormTitle("Добавление нового продукта");
  };
  return (
    <div className="parent-container">
      {categories?.map((c) => {
        return (
          <div className="big-parent" key={`cat-${c._id}`}>
            <div
              className="category"
              onClick={() => {
                handleClear();
                setCatId(c._id);
              }}
            >
              <span>RU: {c.title.ru}</span>
              <span>UZ: {c.title.uz}</span>
            </div>
            {c._id === catId && (
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
                            setSubtitle(c.subtitle);
                            setAmount(c.amount);
                            setPrice(c.price);
                            setImg(null);
                            setImgOld(c.img);
                            setImgTemp(null);
                            setFormTitle("Редактирование продукта");
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
                <div className="item add" onClick={() => handleClear()}>
                  Новый продукт
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
