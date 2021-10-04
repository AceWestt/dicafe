import React, { useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import Section from "../components/Section";
import BgWithElements from "../components/BgWithElements";
import trail from "./imgs/about/trail.svg";
import plane from "./imgs/about/plane.svg";
import { useSceneChangeContext } from "../sceneChangeContext";
import { gsap, Linear } from "gsap";
import { useAxiosGet } from "../hooks/useAxiosGet";
import { useAppContext } from "../context";

const About = () => {
  const { data } = useAxiosGet("/api/aboutscreen");
  const { lang } = useAppContext();

  const {
    cupTargetWrp,
    handleMainScene,
    handleAboutScene,
    handleCupPosChangeRef,
    setIsCartOn,
    cartRef,
  } = useSceneChangeContext();
  const sceneRef = useRef(null);
  const aboutContentElements = useRef([]);
  const backBtnRef = useRef(null);
  const pageTitleRef = useRef(null);
  const bgBigOwlRef = useRef(null);
  const bgSmallOwlRef = useRef(null);

  handleAboutScene.current = {
    ...handleAboutScene.current,
    open: () => {
      sceneRef.current.classList.add("active");
      setIsCartOn(true);
      aboutContentElements.current = [...new Set(aboutContentElements.current)];
      aboutContentElements.current = aboutContentElements.current.filter(
        (a) => a != null
      );
      const tl = gsap.timeline();

      tl.fromTo(
        aboutContentElements.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.3,
          stagger: {
            each: 0.1,
            from: "random",
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
        { y: "-20vw" },
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
        bgBigOwlRef.current,
        { x: "-30vw", y: "-12vw", rotate: 720 },
        {
          x: "0",
          y: "0",
          rotate: 0,
          duration: 2,
          ease: Linear.easeNone,
        }
      );
      tl.fromTo(
        bgSmallOwlRef.current,
        { x: "30vw", y: "-12vw" },
        {
          x: "0",
          y: "0",
          duration: 2,
          ease: Linear.easeNone,
        },
        "<"
      );
    },
  };

  const handleCloseAbout = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        handleMainScene.current.open();
        sceneRef.current.classList.remove("active");
      },
    });
    tl.to(bgSmallOwlRef.current, {
      x: "30vw",
      y: "-12vw",
      duration: 0.5,
      ease: Linear.easeNone,
    });
    tl.to(
      bgBigOwlRef.current,
      {
        x: "-30vw",
        y: "-12vw",
        rotate: 720,
        duration: 0.5,
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      backBtnRef.current,
      {
        x: "-15vw",
        duration: 0.2,
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      pageTitleRef.current,
      {
        y: "-20vw",
        duration: 0.2,
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      cartRef.current?.children,
      {
        x: "20vw",
        duration: 0.2,
        stagger: { each: 0.1 },
        ease: Linear.easeNone,
      },
      "<"
    );
    tl.to(
      aboutContentElements.current,
      {
        scale: 0,
        duration: 0.3,
        stagger: {
          each: 0.1,
          from: "random",
        },
      },
      "<"
    );
    cupTargetWrp.current = handleMainScene.current?.cupRef;
    handleCupPosChangeRef.current();
  };

  return (
    <Section className="about-section" sectionRef={sceneRef}>
      <BgWithElements>
        <img
          src={data?.big_owl}
          id="owl_adult-bg"
          className="owl_adult"
          alt="owl_adult"
          ref={bgBigOwlRef}
        />
        <img
          src={data?.small_owl}
          id="owl_child-bg"
          className="owl_child"
          alt="owl_child"
          ref={bgSmallOwlRef}
        />
        <img
          src={trail}
          id="about-trail-bg"
          className="about-trail only-mobile"
          alt="about-trail"
        />
        <img
          src={plane}
          id="about-plane-bg"
          className="about-plane only-mobile"
          alt="about-plane"
        />
      </BgWithElements>
      <PageWrapper
        className="about-wrapper"
        pageTitle={data?.title[lang]}
        backBtnTitle={data?.back_button[lang]}
        forCupRef={handleAboutScene}
        backBtnRef={backBtnRef}
        pageTitleRef={pageTitleRef}
        handleGoBack={handleCloseAbout}
      >
        <div className="points-wrp">
          <Point
            img={data?.point_one.img}
            title={data?.point_one.title[lang]}
            text={data?.point_one.text[lang]}
            aboutContentElementsRef={aboutContentElements}
          />
          <Point
            img={data?.point_two.img}
            title={data?.point_two.title[lang]}
            text={data?.point_two.text[lang]}
            aboutContentElementsRef={aboutContentElements}
          />
          <Point
            img={data?.point_three.img}
            title={data?.point_three.title[lang]}
            text={data?.point_three.text[lang]}
            aboutContentElementsRef={aboutContentElements}
          />
        </div>
      </PageWrapper>
    </Section>
  );
};

const Point = ({ className, img, title, text, aboutContentElementsRef }) => {
  return (
    <div className={className ? `point ${className}` : "point"}>
      <div className="img-wrp">
        <div className="img">
          <img
            src={img}
            alt="point-img"
            ref={(e) => aboutContentElementsRef.current.push(e)}
          />
        </div>
      </div>

      <h3 ref={(e) => aboutContentElementsRef.current.push(e)}>{title}</h3>
      <p ref={(e) => aboutContentElementsRef.current.push(e)}>{text}</p>
    </div>
  );
};

export default About;
