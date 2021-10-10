import React, { useEffect, useRef, useCallback } from "react";
import Section from "../components/Section";
import BgWithElements from "../components/BgWithElements";
import Cup from "../components/Cup";
import labelIcn from "./imgs/main/label.svg";
import doodlesArrowMobile from "./imgs/main/doodles-arrow-mobile.svg";
import aboutArrowMobile from "./imgs/main/about-arrow-mobile.svg";
import orderArrowMobile from "./imgs/main/order-arrow-mobile.svg";
import contactArrowMobile from "./imgs/main/contact-arrow-mobile.svg";
import { useAppContext } from "../context";
import { gsap, Linear } from "gsap";
import { useSceneChangeContext } from "../sceneChangeContext";
import { useAxiosGet } from "../hooks/useAxiosGet";
import music from "./audio/music.mp3";

const labelTl = gsap.timeline({ repeat: -1 });

const Main = () => {
  const { data } = useAxiosGet("/api/mainscreen");

  const { smallScreen, rendered, isMusicOn } = useAppContext();
  const { handleMainScene } = useSceneChangeContext();

  const cloudsRef = useRef([]);
  const labelsRef = useRef([]);
  const labelsParentsRef = useRef([]);
  const bgElementsRef = useRef([]);
  const rotateHintRef = useRef(null);
  const targetRotation = useRef(null);
  const musicRef = useRef(null);

  const labelsActionsRef = useRef({
    about: {},
    order: {},
    doodles: {},
    contact: {},
  });

  const handleSceneOpen = useCallback(() => {
    const gbTl = gsap.timeline();
    gbTl.fromTo(
      bgElementsRef.current.children,
      { scale: 0 },
      { scale: 1, duration: 0.3, ease: Linear.easeInOut }
    );
    gbTl.fromTo(
      bgElementsRef.current.children,
      { scale: 0.95 },
      {
        scale: 1,
        duration: 0.05,
        repeat: 4,
        yoyo: true,
        onComplete: () => {
          labelsParentsRef.current[0].style.display = "flex";
          labelsParentsRef.current[1].style.display = "flex";
          rotateHintRef.current.style.display = "block";

          labelTl.resume();
        },
      }
    );
    gbTl.to(labelsParentsRef.current, {
      opacity: 1,
      duration: 0.3,
    });
    gbTl.to(labelsRef.current, {
      opacity: 1,
      duration: 0.1,
      stagger: {
        each: 0.2,
        // onComplete: function () {
        //   gsap.fromTo(
        //     this.targets()[0],
        //     { rotateY: 360 },
        //     { rotateY: 0, duration: 0.1, repeat: 4 }
        //   );
        // },
      },
    });
  }, []);

  const handleSceneClose = () => {
    return new Promise((resolve) => {
      const gbTl = gsap.timeline({
        onComplete: () => {
          resolve(true);
        },
      });
      gbTl.fromTo(
        bgElementsRef.current.children,
        { scale: 1 },
        { scale: 0.95, duration: 0.05, repeat: 4, yoyo: true }
      );
      gbTl.fromTo(
        bgElementsRef.current.children,
        { scale: 1 },
        { scale: 0, duration: 0.3, ease: Linear.easeInOut }
      );
      gbTl.fromTo(
        labelsRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.1,
          stagger: {
            each: 0.2,
          },
          onComplete: () => {
            gsap.to(labelsParentsRef.current, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                labelsParentsRef.current[0].style.display = "none";
                labelsParentsRef.current[1].style.display = "none";
                rotateHintRef.current.style.display = "none";
                labelTl.pause();
              },
            });
          },
        },
        "<"
      );
    });
  };
  const handleSceneIdle = () => {
    gsap.fromTo(
      cloudsRef.current,
      { x: -10 },
      {
        x: 10,
        duration: 3,
        stagger: {
          each: 1,
          repeat: -1,
          yoyo: true,
        },
        ease: Linear.easeNone,
      }
    );

    labelTl.set(labelsRef.current, { rotate: 0 });
    labelTl.fromTo(
      labelsRef.current,
      { rotate: -10 },
      {
        rotate: 10,
        duration: 0.5,
        stagger: {
          each: 3,
          repeat: 2,
          yoyo: true,
          onComplete: function () {
            gsap.to(this.targets()[0], {
              rotate: 0,
              duration: 0.2,
              ease: Linear.easeInOut,
            });
          },
        },

        ease: Linear.easeNone,
      }
    );
    gsap.fromTo(
      rotateHintRef.current,
      { rotateY: 0 },
      { rotateY: 360, duration: 0.5, repeat: -1, repeatDelay: 5 }
    );
  };

  useEffect(() => handleSceneIdle(), []);
  useEffect(() => {
    handleMainScene.current = {
      ...handleMainScene.current,
      open: () => handleSceneOpen(),
    };
  }, [handleMainScene, handleSceneOpen]);
  useEffect(() => {
    if (rendered) {
      handleSceneOpen();
    }
  }, [rendered, handleSceneOpen]);

  useEffect(() => {
    if (isMusicOn) {
      musicRef.current.play();
    } else {
      musicRef.current.pause();
    }
  }, [isMusicOn]);
  return (
    <Section className="main-section">
      <BgWithElements bgRef={bgElementsRef}>
        {!smallScreen && (
          <>
            <img
              src={data?.sattelite}
              id="satellite-bg"
              className="satellite only-desktop"
              alt="satellite"
            />

            <img
              src={data?.flower}
              id="flower-bg"
              className="flower only-desktop"
              alt="flower"
            />
            <img
              src={data?.seamonster}
              id="seamonster-bg"
              className="seamonster"
              alt="seamonster"
            />
            <img
              src={data?.snicker}
              id="snicker-bg"
              className="snicker only-desktop"
              alt="snicker"
            />
            <img
              src={data?.houses}
              id="houses-bg"
              className="houses"
              alt="houses"
            />
          </>
        )}
        <img src={data?.lamp} id="lamp-bg" className="lamp" alt="lamp" />
        <img
          src={data?.cloud_big}
          id="cloud_big-bg"
          className="cloud_big"
          alt="cloud_big"
          ref={(e) => cloudsRef.current.push(e)}
        />
        <img
          src={data?.cloud_small}
          id="cloud_small-bg"
          className="cloud_small"
          alt="cloud_small"
          ref={(e) => cloudsRef.current.push(e)}
        />
      </BgWithElements>
      <div className="main-content">
        <div
          className="labels left"
          ref={(e) => {
            if (e) labelsParentsRef.current[0] = e;
          }}
        >
          <Label
            className="doodles"
            label="Ваши дудлы"
            icn={smallScreen ? doodlesArrowMobile : null}
            labelRef={(e) => {
              if (e) labelsRef.current[0] = e;
            }}
            onMouseEnter={() => {
              labelsActionsRef.current.doodles.mouseEnter();
              targetRotation.current = 1.459;
            }}
            onMouseLeave={() => {
              labelsActionsRef.current.doodles.mouseLeave();
              targetRotation.current = null;
            }}
            onClick={() => {
              labelsActionsRef.current.doodles.click();
            }}
          />
          <Label
            className="about"
            label="Посмотреть кто мы можно тут"
            icn={smallScreen ? aboutArrowMobile : null}
            labelRef={(e) => {
              if (e) labelsRef.current[1] = e;
            }}
            onMouseEnter={() => {
              labelsActionsRef.current.about.mouseEnter();
              targetRotation.current = 1.757;
            }}
            onMouseLeave={() => {
              labelsActionsRef.current.about.mouseLeave();
              targetRotation.current = null;
            }}
            onClick={() => {
              labelsActionsRef.current.about.click();
            }}
          />
        </div>
        <Cup
          labelsRef={labelsRef}
          handleCloseMain={handleSceneClose}
          rotateHintRef={rotateHintRef}
          labelsActionsRef={labelsActionsRef}
          targetRotation={targetRotation}
        />
        <div
          className="labels right"
          ref={(e) => {
            if (e) labelsParentsRef.current[1] = e;
          }}
        >
          <Label
            className="order"
            label="Заказать кофе можно тут"
            icn={smallScreen ? orderArrowMobile : null}
            labelRef={(e) => {
              if (e) labelsRef.current[2] = e;
            }}
            onMouseEnter={() => {
              labelsActionsRef.current.order.mouseEnter();
              targetRotation.current = 0.627;
            }}
            onMouseLeave={() => {
              labelsActionsRef.current.order.mouseLeave();
              targetRotation.current = null;
            }}
            onClick={() => {
              labelsActionsRef.current.order.click();
            }}
          />
          <Label
            className="contact"
            label="Контактная информация"
            icn={smallScreen ? contactArrowMobile : null}
            labelRef={(e) => {
              if (e) labelsRef.current[3] = e;
            }}
            onMouseEnter={() => {
              labelsActionsRef.current.contact.mouseEnter();
              targetRotation.current = -0.002;
            }}
            onMouseLeave={() => {
              labelsActionsRef.current.contact.mouseLeave();
              targetRotation.current = null;
            }}
            onClick={() => {
              labelsActionsRef.current.contact.click();
            }}
          />
        </div>
      </div>
      <audio autoPlay loop src={music} ref={musicRef}>
        Your browser does not support the audio element.
      </audio>
    </Section>
  );
};

const Label = ({
  className,
  label,
  icn,
  labelRef,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <div className={className ? `label ${className}` : "label"}>
      <span
        ref={labelRef}
        onMouseEnter={(e) => {
          gsap.to(e.target, {
            scale: 1.3,
            duration: 0.3,
            ease: Linear.easeNone,
          });
          onMouseEnter();
        }}
        onMouseLeave={(e) => {
          gsap.to(e.target, {
            scale: 1,
            duration: 0.3,
            ease: Linear.easeNone,
          });
          onMouseLeave();
        }}
        onClick={onClick}
      >
        {label}
      </span>
      <img src={icn ? icn : labelIcn} className="icn" alt="label" />
    </div>
  );
};

export default Main;
