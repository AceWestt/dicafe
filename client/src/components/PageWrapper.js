import React from "react";

const PageWrapper = ({
  className,
  pageTitle,
  backBtnTitle,
  isRighted,
  forCupRef,
  backBtnRef,
  pageTitleRef,
  handleGoBack,
  children,
}) => {
  return (
    <div
      className={`page-wrapper ${isRighted ? "righted" : ""} ${
        className ? className : ""
      }`}
    >
      <div className="header">
        <div className="back-btn" ref={backBtnRef} onClick={handleGoBack}>
          {"<"} {backBtnTitle || "Вернуться"}
        </div>
        <h2 className="only-desktop" ref={pageTitleRef}>
          {pageTitle}
        </h2>
      </div>
      <div className="content">
        <div className="for-content">{children}</div>
        <div
          className="for-cup"
          ref={(e) => {
            if (forCupRef) {
              forCupRef.current = { ...forCupRef?.current, cupRef: e };
            }
          }}
        ></div>
      </div>
    </div>
  );
};

export default PageWrapper;
