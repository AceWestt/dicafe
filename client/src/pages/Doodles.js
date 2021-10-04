import React, { useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import Section from "../components/Section";
import { useAppContext } from "../context";
import checkout_arrow from "./imgs/doodles/checkout-arrow.svg";
import { useSceneChangeContext } from "../sceneChangeContext";
import { gsap, Linear } from "gsap";
import { useAxiosGet } from "../hooks/useAxiosGet";
import uploadModalBg from "./imgs/doodles/uploadModalBg.svg";
import uploadModalBgMobile from "./imgs/doodles/uploadModalBgMobile.svg";
import stepOneImg from "./imgs/doodles/stepone.svg";
import stepTwoImg from "./imgs/doodles/steptwo.svg";
import stepThreeImg from "./imgs/doodles/stepthree.svg";
import linesImg from "./imgs/doodles/lines.svg";
import linesImgMobile from "./imgs/doodles/linesMobile.svg";
import modalCloseImg from "./imgs/doodles/modalClose.svg";
import { validateImgs } from "../admin/utils/validate";
import axios from "axios";

const Doodles = () => {
  const { smallScreen, lang } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useAxiosGet("/api/doodlescreen");

  const sectionRef = useRef(null);

  const backBtnRef = useRef(null);
  const pageTitleRef = useRef(null);
  const doodleImgRef = useRef(null);

  const {
    cupTargetWrp,
    handleMainScene,
    handleCupPosChangeRef,
    setIsCartOn,
    cartRef,
    handleDoodleScene,
  } = useSceneChangeContext();

  handleDoodleScene.current = {
    ...handleDoodleScene.current,
    open: () => {
      sectionRef.current.classList.add("active");
      setIsCartOn(true);

      const tl = gsap.timeline();

      tl.fromTo(
        backBtnRef.current,
        { x: "-15vw" },
        {
          x: "0",
          duration: 0.2,
          ease: Linear.easeNone,
        }
      );
      tl.fromTo(
        pageTitleRef.current,
        {
          y: "-20vw",
        },
        {
          y: "0",
          duration: 0.2,
          ease: Linear.easeNone,
        },
        "<"
      );
      tl.fromTo(
        cartRef.current?.children,
        { x: "20vw" },
        {
          x: "0",
          duration: 0.2,
          stagger: { each: 0.1 },
          ease: Linear.easeNone,
        },
        "<"
      );
      tl.fromTo(
        doodleImgRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: Linear.easeNone }
      );
    },
  };

  const handleCloseDoodles = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        handleMainScene.current.open();
        sectionRef.current.classList.remove("active");
      },
    });
    tl.to(backBtnRef.current, {
      x: "-15vw",
      duration: 0.5,
      ease: Linear.easeNone,
    });
    tl.to(
      pageTitleRef.current,

      {
        y: "-20vw",
        duration: 0.5,
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      cartRef.current?.children,
      {
        x: "20vw",
        duration: 0.5,
        stagger: { each: 0.1 },
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      doodleImgRef.current,
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: Linear.easeNone,
      },
      "<"
    );
    cupTargetWrp.current = handleMainScene.current?.cupRef;
    handleCupPosChangeRef.current();
  };

  return (
    <Section className="doodles-section" sectionRef={sectionRef}>
      {isModalOpen && (
        <DoodleUploadModal
          className=""
          smallScreen={smallScreen}
          lang={lang}
          icon={data?.upload_button_icn}
          text={data?.upload_button_text[lang]}
          onClick={() => console.log("upload")}
          closeModal={() => setIsModalOpen(false)}
        />
      )}

      <PageWrapper
        className="doodles-wrapper"
        pageTitle={data?.title[lang]}
        backBtnTitle={data?.back_button[lang]}
        forCupRef={handleDoodleScene}
        backBtnRef={backBtnRef}
        pageTitleRef={pageTitleRef}
        handleGoBack={handleCloseDoodles}
      >
        <DoodleUpload
          icon={data?.upload_button_icn}
          text={data?.upload_button_text[lang]}
          onClick={() => setIsModalOpen(true)}
        />
        <img
          src={smallScreen ? data?.doodles_img_mobile : data?.doodles_img}
          className="doodles-demo"
          alt="doodles"
          ref={doodleImgRef}
        />
      </PageWrapper>
    </Section>
  );
};

const DoodleUpload = ({ icon, text, onClick }) => {
  return (
    <div className="doodles-upload-wrp">
      <img src={icon} alt="upload your doodle" />
      <button onClick={onClick}>
        <span>{text}</span>
        <img src={checkout_arrow} alt="upload your doodle" />
      </button>
    </div>
  );
};

const DoodleUploadModal = ({
  className,
  smallScreen,
  lang,
  icon,
  text,
  onClick,
  closeModal,
}) => {
  const [msg, setMsg] = useState("");
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const valid = validateImgs(file);
      if (!valid.valid) {
        setMsg(valid.msg);
      } else {
        setMsg("");
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const formData = new FormData();
        formData.append("doodle", file);
        try {
          const res = await axios.post(`/api/userdoodles/`, formData, config);
          if (res.data.status === "success") {
            window.location.reload();
          }
        } catch (error) {
          console.error(error);
          console.log(error.response);
        }
      }
    } else {
      setMsg("");
    }
    console.log();
  };
  return (
    <div className={className ? `upload-modal ${className}` : "upload-modal"}>
      <div className="modal-container">
        <img
          src={smallScreen ? uploadModalBgMobile : uploadModalBg}
          alt="upload your doodle"
          className="modal-gen-bg"
        />
        <div className="modal-content">
          <div className="title">
            {lang === "ru"
              ? "Инструкция “Загрузи свой дудл”"
              : "“O`z doodlingni yukla” qo`llanmasi"}
          </div>
          <div className="instructions">
            <div className="item stepone">
              <img src={stepOneImg} alt="step one" />
              <div className="text">
                <span>{lang === "ru" ? "Шаг 1" : "1 Qadam"}</span>
                <span>
                  {lang === "ru" ? `Нарисуй свой дудл` : "O`z dudlingni chiz"}
                </span>
              </div>
            </div>
            <div className="middle">
              <img src={smallScreen ? linesImgMobile : linesImg} alt="lines" />
            </div>
            <div className="item steptwo">
              <img src={stepTwoImg} alt="step two" />
              <div className="text">
                <span>{lang === "ru" ? "Шаг 2" : "2 Qadam"}</span>
                <span>{lang === "ru" ? "Сфоткай его" : "Su`ratga ol"}</span>
              </div>
            </div>
            <div className="middle">
              <img src={smallScreen ? linesImgMobile : linesImg} alt="lines" />
            </div>
            <div className="item stepthree">
              <img src={stepThreeImg} alt="step three" />
              <div className="text">
                <span>{lang === "ru" ? "Шаг 3" : "3 Qadam"}</span>
                <span>
                  {lang === "ru"
                    ? "Загрузи фото через конпку «Загрузить свой дудл»"
                    : "«O`z dudlingni yukla» tugmasi orqali su`ratni yukla"}
                </span>
              </div>
            </div>
          </div>
          <div className="middle-text">
            {lang === "ru"
              ? `Кидай любой рисунок! Самые крутые обязательно окажутся здесь 👍`
              : `Xohlagan rasmingni tashla! Eng zo\`rlari albatta shu yerda paydo bo\`ladi 👍`}
          </div>
          {msg && <p className="text-danger">{msg}</p>}
          <div className="btn-holder">
            <DoodleUpload icon={icon} text={text} onClick={onClick} />
            <input type="file" onChange={handleUpload} />
          </div>
        </div>
        <img
          src={modalCloseImg}
          alt="close"
          className="modal-close"
          onClick={closeModal}
        />
      </div>
    </div>
  );
};

export default Doodles;
