import React, { useRef, useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import Section from "../components/Section";
import BgWithElements from "../components/BgWithElements";
import checkout_arrow from "./imgs/choose/checkout-arrow.svg";
import activeCategoryBgMobile from "./imgs/choose/active-category-bg.svg";
import activeArrowIcn from "./imgs/choose/arrow-active.svg";
import mobileCatListBg from "./imgs/choose/category-list-bg.svg";
import { useAppContext } from "../context";
import { useSceneChangeContext } from "../sceneChangeContext";
import { gsap, Linear } from "gsap";
import { useAxiosGet } from "../hooks/useAxiosGet";
import plajka from "./imgs/choose/plajka.png";
import prevSlideImg from "./imgs/choose/prevSlide.svg";
import nextSlideImg from "./imgs/choose/nextslide.svg";

const Choose = () => {
  const { lang, smallScreen } = useAppContext();
  const { data } = useAxiosGet("/api/orderscreen");
  const { data: categories } = useAxiosGet("/api/products/cats");
  const [activeCategory, setActiveCategory] = useState(null);
  const { data: products } = useAxiosGet(`/api/products/products`);
  const currentProductSlide = useRef(0);
  const sliderControl = useRef(null);

  useEffect(() => {
    if (categories) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  const {
    cupTargetWrp,
    handleMainScene,
    handleCupPosChangeRef,
    handleOrderScene,
  } = useSceneChangeContext();
  const sceneRef = useRef(null);
  const backBtnRef = useRef(null);
  const pageTitleRef = useRef(null);
  const skaterRef = useRef(null);
  const coronaRef = useRef(null);
  const categoriesRef = useRef([]);
  const productImgsRef = useRef([]);
  const textContentRef = useRef([]);
  const productsScrollLeft = useRef([]);
  const plajkaRef = useRef(null);

  handleOrderScene.current = {
    ...handleOrderScene.current,
    open: () => {
      sceneRef.current.classList.add("active");
      const tl = gsap.timeline();
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
      }
      tl.fromTo(
        coronaRef.current,
        {
          y: "-20vw",
          rotate: 180,
        },
        {
          y: "0",
          rotate: 0,
          duration: 0.5,
          ease: Linear.easeNone,
        }
      );
      if (!smallScreen) {
        tl.fromTo(
          skaterRef.current,
          { y: "20vw", rotate: 180 },
          {
            y: "0",
            rotate: 0,
            duration: 0.5,
            ease: Linear.easeNone,
          },
          "<"
        );
        tl.fromTo(
          skaterRef.current,
          { x: "0" },
          {
            x: "110vw",
            duration: 3,
            ease: Linear.easeNone,
          },
          "<"
        );
        tl.fromTo(
          categoriesRef.current,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.2,
            stagger: {
              each: 0.2,
              onComplete: function () {
                gsap.fromTo(
                  this.targets()[0],
                  { scale: 1.25 },
                  { scale: 1, duration: 0.1, repeat: 2, yoyo: true }
                );
              },
            },
          },
          "<"
        );
        tl.fromTo(
          plajkaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.005, ease: Linear.easeNone },
          "<"
        );
        tl.fromTo(
          sliderControl.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: Linear.easeNone,
          },
          "<"
        );
      }

      tl.fromTo(
        productImgsRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.2,
          stagger: {
            each: 0.2,
            onComplete: function () {
              gsap.fromTo(
                this.targets()[0],
                { scale: 1.25 },
                { scale: 1, duration: 0.1, repeat: 2, yoyo: true }
              );
            },
          },
        },
        "<"
      );

      tl.fromTo(
        textContentRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          stagger: {
            each: 0.12,
          },
        },
        "<"
      );
    },
  };

  const handleCloseOrder = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        handleMainScene.current.open();
        sceneRef.current.classList.remove("active");
      },
    });
    tl.to(backBtnRef.current, {
      x: "-30vw",
      duration: 0.5,
      ease: Linear.easeNone,
    });
    if (!smallScreen) {
      tl.to(
        pageTitleRef.current,
        {
          y: "-20vw",
          duration: 0.5,
          ease: Linear.easeNone,
        },
        "<"
      );
    }

    tl.to(
      coronaRef.current,
      {
        y: "-20vw",
        rotate: 180,
        duration: 0.5,
        ease: Linear.easeNone,
      },
      "<"
    );

    if (!smallScreen) {
      tl.to(
        skaterRef.current,
        {
          y: "20vw",
          rotate: 180,
          duration: 0.5,
          ease: Linear.easeNone,
        },
        "<"
      );
      tl.to(
        categoriesRef.current,
        {
          scale: 0,
          duration: 0.5,
          stagger: {
            each: 0.2,
          },
        },
        "<"
      );
      tl.to(
        plajkaRef.current,
        { opacity: 0, duration: 0.005, ease: Linear.easeNone },
        "<"
      );
      tl.to(
        sliderControl.current,
        {
          opacity: 0,
          duration: 0.05,
          ease: Linear.easeNone,
        },
        "<"
      );
    }
    tl.to(
      productImgsRef.current,
      {
        scale: 0,
        duration: 0.35,
        stagger: {
          each: 0.05,
        },
      },
      "<"
    );
    tl.to(
      textContentRef.current,
      {
        scale: 0,
        duration: 0.35,
        stagger: {
          each: 0.05,
        },
      },
      "<"
    );
    cupTargetWrp.current = handleMainScene.current?.cupRef;
    handleCupPosChangeRef.current();
  };

  let productTextIndex = 0;

  return (
    <Section className="choose-section" sectionRef={sceneRef}>
      <BgWithElements>
        <img
          src={data?.crown}
          id="corona-bg"
          className="corona"
          alt="corona"
          ref={coronaRef}
        />
        <img
          src={data?.skater}
          id="ghost_skater-bg"
          className="ghost_skater"
          alt="ghost_skater"
          ref={skaterRef}
        />
      </BgWithElements>
      <PageWrapper
        className="choose-wrapper"
        pageTitle={data?.title[lang]}
        backBtnTitle={data?.back_button[lang]}
        isRighted
        forCupRef={handleOrderScene}
        backBtnRef={backBtnRef}
        pageTitleRef={pageTitleRef}
        handleGoBack={handleCloseOrder}
      >
        <div className="coffee-menu">
          <div className="products">
            {products?.map((p, i) => {
              if (p.category_id === activeCategory?._id) {
                if (i > 0) {
                  productTextIndex += 4;
                }
                return (
                  <Product
                    product={p}
                    key={`product-${p._id}`}
                    scrollRef={productsScrollLeft}
                    productImgsRef={productImgsRef}
                    textContentRef={textContentRef}
                    lang={lang}
                    index={i}
                    textIndex={productTextIndex}
                  />
                );
              }
              return "";
            })}
          </div>
          {!smallScreen && (
            <img src={plajka} className="plajka" alt="plajka" ref={plajkaRef} />
          )}
          {!smallScreen && (
            <div className="slider-control" ref={sliderControl}>
              <img
                src={prevSlideImg}
                alt="prevSlide"
                onClick={() => {
                  if (currentProductSlide.current >= 0) {
                    gsap.to(productsScrollLeft.current, {
                      x: "+=20vw",
                      duration: 0.3,
                    });
                    currentProductSlide.current--;
                  }
                }}
              />
              <img
                src={nextSlideImg}
                alt="nextSlide"
                onMouseDown={() => {
                  if (currentProductSlide.current < products?.length - 2) {
                    gsap.to(productsScrollLeft.current, {
                      x: "-=20vw",
                      duration: 0.3,
                    });
                    currentProductSlide.current++;
                  }
                }}
              />
            </div>
          )}

          <Categories
            activeCategroy={activeCategory}
            setActiveCategory={setActiveCategory}
            categoriesRef={categoriesRef}
            categories={categories}
          />
        </div>
      </PageWrapper>
    </Section>
  );
};

const Product = ({
  product,
  productImgsRef,
  textContentRef,
  lang,
  scrollRef,
  index,
  textIndex,
}) => {
  const { _id, img, title, subtitle, price } = product;

  return (
    <div
      className="product"
      ref={(e) => {
        if (e) scrollRef.current[index] = e;
      }}
    >
      <img
        src={img}
        alt={`product-${_id}`}
        ref={(e) => {
          if (e) {
          }
          productImgsRef.current[index] = e;
        }}
      />
      <h5
        ref={(e) => {
          if (e) textContentRef.current[textIndex] = e;
        }}
      >
        {title[lang]}
      </h5>
      <h6
        ref={(e) => {
          if (e) textContentRef.current[textIndex + 1] = e;
        }}
      >
        {subtitle[lang]}
      </h6>
      <p
        ref={(e) => {
          if (e) textContentRef.current[textIndex + 2] = e;
        }}
      >
        {price} {lang === "ru" ? "сум" : "so'm"}
      </p>
      <button
        ref={(e) => {
          if (e) textContentRef.current[textIndex + 3] = e;
        }}
        onClick={() => {
          console.log(_id);
        }}
      >
        <span>
          {lang === "ru" ? "Добавить в корзинку" : "Savatga qo'shish"}
        </span>
        <img src={checkout_arrow} alt="Добавить в корзинку" />
      </button>
    </div>
  );
};

const Categories = ({
  activeCategroy,
  setActiveCategory,
  categoriesRef,
  categories,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { smallScreen, lang } = useAppContext();
  if (smallScreen) {
    return (
      <div className="categories-mobile">
        <div className={isMobileMenuOpen ? "list-wrp active" : "list-wrp"}>
          <div className="list">
            <img src={mobileCatListBg} alt="categories" />
            <div className="list-menu">
              {categories?.map((c) => {
                if (activeCategroy === c) {
                  return undefined;
                }
                return (
                  <div
                    key={`category-${c._id}`}
                    onClick={() => {
                      setActiveCategory(c);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {c.title[lang]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="active-category"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        >
          <img src={activeCategoryBgMobile} alt="active-categroy" />
          <div className="text">
            <span>{activeCategroy?.title?.[lang]}</span>
            <img
              src={activeArrowIcn}
              alt="active-category"
              className={isMobileMenuOpen ? "rotated" : undefined}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="categories">
      {categories?.map((c, i) => {
        return (
          <div
            key={`category-${c._id}`}
            className={c === activeCategroy ? "active" : ""}
            onClick={() => {
              setActiveCategory(c);
            }}
            ref={(e) => {
              if (e) categoriesRef.current[i] = e;
            }}
          >
            {c.title[lang]}
          </div>
        );
      })}
    </div>
  );
};

export default Choose;
