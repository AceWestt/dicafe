import React from "react";
import { CgSwap } from "react-icons/cg";

const IconImgSwapShow = ({ oldImg, newImg, type }) => {
  return (
    <div
      className={`form-control icn-img-changing ${
        type === "icon" ? "icn" : "img"
      }`}
    >
      {oldImg && <img src={oldImg} className="current" alt="current" />}
      {oldImg && newImg && <CgSwap className="icon" />}
      {newImg && <img src={newImg} className="new" alt="new" />}
    </div>
  );
};

export default IconImgSwapShow;
