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
  const { lang, smallScreen } = useAppContext();

  const {
    cupTargetWrp,
    handleMainScene,
    handleAboutScene,
    handleCupPosChangeRef,
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
      const tl = gsap.timeline();

      tl.fromTo(
        aboutContentElements.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: {
            each: 0.1,
            from: "random",
          },
        }
      );
      tl.fromTo(
        backBtnRef.current,
        { x: "-15vw", opacity: 0 },
        {
          x: "0",
          opacity: 1,
          duration: 0.2,
          ease: Linear.easeNone,
        }
      );
      if (!smallScreen) {
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
      }
      tl.fromTo(
        bgBigOwlRef.current,
        { x: smallScreen ? "-50vw" : "-30vw", y: "-12vw", rotate: 720 },
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
        { x: smallScreen ? "50vw" : "30vw", y: "-12vw", rotate: -720 },
        {
          x: "0",
          y: "0",
          rotate: 0,
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
        opacity: 0,
        duration: 0.2,
        ease: Linear.easeNone,
      },
      "<"
    );
    if (!smallScreen) {
      tl.to(
        pageTitleRef.current,
        {
          y: "-20vw",
          duration: 0.2,
          ease: Linear.easeNone,
        },
        "<"
      );
    }
    tl.to(
      aboutContentElements.current,
      {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        stagger: {
          each: 0.05,
          from: "end",
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
            n={0}
          />
          <Point
            img={data?.point_two.img}
            title={data?.point_two.title[lang]}
            text={data?.point_two.text[lang]}
            aboutContentElementsRef={aboutContentElements}
            n={3}
          />
          <Point
            img={data?.point_three.img}
            title={data?.point_three.title[lang]}
            text={data?.point_three.text[lang]}
            aboutContentElementsRef={aboutContentElements}
            n={6}
          />
        </div>
      </PageWrapper>
    </Section>
  );
};

const Point = ({ className, img, title, text, aboutContentElementsRef, n }) => {
  return (
    <div className={className ? `point ${className}` : "point"}>
      <div className="img-wrp">
        <div className="img">
          <img
            src={img}
            alt="point-img"
            ref={(e) => {
              if (e) aboutContentElementsRef.current[n] = e;
            }}
          />
        </div>
      </div>

      <h3
        ref={(e) => {
          if (e) aboutContentElementsRef.current[n + 1] = e;
        }}
      >
        {title}
      </h3>
      <p
        ref={(e) => {
          if (e) aboutContentElementsRef.current[n + 2] = e;
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default About;
