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

  useEffect(() => {
    if (categories) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  const {
    cupTargetWrp,
    handleMainScene,
    handleCupPosChangeRef,
    setIsCartOn,
    cartRef,
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

  handleOrderScene.current = {
    ...handleOrderScene.current,
    open: () => {
      sceneRef.current.classList.add("active");
      setIsCartOn(true);
      categoriesRef.current = [...new Set(categoriesRef.current)];
      categoriesRef.current = categoriesRef.current.filter((a) => a != null);
      productImgsRef.current = [...new Set(productImgsRef.current)];
      productImgsRef.current = productImgsRef.current.filter((a) => a != null);
      textContentRef.current = [...new Set(textContentRef.current)];
      textContentRef.current = textContentRef.current.filter((a) => a != null);

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
      tl.from(
        coronaRef.current,
        {
          y: "-10vw",
          rotate: 180,
        },
        {
          y: "0",
          rotate: 0,
          duration: 0.5,
          ease: Linear.easeNone,
        }
      );
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
          duration: 0.2,
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
      coronaRef.current,
      {
        y: "-10vw",
        rotate: 180,
        duration: 0.5,
        ease: Linear.easeNone,
      },
      "<"
    );
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
      productImgsRef.current,
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
      textContentRef.current,
      {
        scale: 0,
        duration: 0.5,
        stagger: {
          each: 0.03,
        },
      },
      "<"
    );
    cupTargetWrp.current = handleMainScene.current?.cupRef;
    handleCupPosChangeRef.current();
  };

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
            {products?.map((p) => {
              if (p.category_id === activeCategory?._id) {
                return (
                  <Product
                    product={p}
                    key={`product-${p._id}`}
                    scrollRef={productsScrollLeft}
                    productImgsRef={productImgsRef}
                    textContentRef={textContentRef}
                    lang={lang}
                  />
                );
              }
              return "";
            })}
          </div>
          {!smallScreen && <img src={plajka} className="plajka" alt="plajka" />}
          {!smallScreen && (
            <div className="slider-control">
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
}) => {
  const { _id, img, title, subtitle, price } = product;
  return (
    <div className="product" ref={(e) => scrollRef.current.push(e)}>
      <img
        src={img}
        alt={`product-${_id}`}
        ref={(e) => {
          productImgsRef.current.push(e);
        }}
      />
      <h5 ref={(e) => textContentRef.current.push(e)}>{title[lang]}</h5>
      <h6 ref={(e) => textContentRef.current.push(e)}>{subtitle[lang]}</h6>
      <p ref={(e) => textContentRef.current.push(e)}>
        {price} {lang === "ru" ? "сум" : "so'm"}
      </p>
      <button
        ref={(e) => textContentRef.current.push(e)}
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
      {categories?.map((c) => {
        return (
          <div
            key={`category-${c._id}`}
            className={c === activeCategroy ? "active" : ""}
            onClick={() => {
              setActiveCategory(c);
            }}
            ref={(e) => categoriesRef.current.push(e)}
          >
            {c.title[lang]}
          </div>
        );
      })}
    </div>
  );
};

export default Choose;
