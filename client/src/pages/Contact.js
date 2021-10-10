import React, { useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import Section from "../components/Section";
import BgWithElements from "../components/BgWithElements";
import { useAppContext } from "../context";
import { useSceneChangeContext } from "../sceneChangeContext";
import { gsap, Linear } from "gsap";
import { useAxiosGet } from "../hooks/useAxiosGet";
import catMobileImg from "./imgs/contact/cat-mobile.svg";

const Contact = () => {
  const { smallScreen, lang } = useAppContext();
  const { data } = useAxiosGet("/api/contactscreen");

  const sectionRef = useRef(null);

  const backBtnRef = useRef(null);
  const pageTitleRef = useRef(null);
  const addressRef = useRef(null);
  const mapImgRef = useRef(null);

  const {
    cupTargetWrp,
    handleMainScene,
    handleCupPosChangeRef,
    setIsCopyOn,
    handleContactScene,
  } = useSceneChangeContext();

  handleContactScene.current = {
    ...handleContactScene.current,
    open: () => {
      sectionRef.current.classList.add("active");
      setIsCopyOn(true);

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
        addressRef.current.children,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.3,
          stagger: {
            each: 0.03,
            onComplete: function () {
              gsap.fromTo(
                this.targets()[0],
                { scale: 1.25 },
                { scale: 1, duration: 0.1, repeat: 2, yoyo: true }
              );
            },
          },
        }
      );
      tl.fromTo(
        mapImgRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.3, ease: Linear.easeNone }
      );
    },
  };

  const handleCloseContact = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        handleMainScene.current.open();
        sectionRef.current.classList.remove("active");
        setIsCopyOn(false);
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
      addressRef.current.children,
      {
        scale: 0,
        duration: 0.5,
        stagger: {
          each: 0.05,
        },
      },
      "<"
    );
    tl.to(
      mapImgRef.current,
      {
        scaleX: 0,
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
    <Section className="contact-section" copy sectionRef={sectionRef}>
      <BgWithElements>
        <img
          src={catMobileImg}
          id="cat-mobile-bg"
          className="cat-mobile only-mobile"
          alt="cat-mobile"
        />
      </BgWithElements>
      <PageWrapper
        className="contact-wrapper"
        pageTitle={data?.title[lang]}
        backBtnTitle={data?.back_button[lang]}
        isRighted
        forCupRef={handleContactScene}
        backBtnRef={backBtnRef}
        pageTitleRef={pageTitleRef}
        handleGoBack={handleCloseContact}
      >
        <div className="address" ref={addressRef}>
          <img
            src={smallScreen ? data?.address_icn_mobile : data?.address_icn}
            alt="address"
          />
          <span>{data?.address[lang]}</span>
          {smallScreen && (
            <>
              <img src={data?.phone_icn} alt="phone" />
              <span>{data?.phone}</span>
            </>
          )}
        </div>
        <iframe
          ref={mapImgRef}
          title="map"
          className="map"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A475525304e2b86176fbdc7b97099214263d19b8fe20e639bfc26b44790192b49&amp;source=constructor"
          width="100%"
          frameBorder="0"
        ></iframe>
      </PageWrapper>
    </Section>
  );
};

export default Contact;
