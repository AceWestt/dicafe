import React, { useState } from "react";
import { useAdminContext } from "../context";
import { GoChevronLeft } from "react-icons/go";
import { GoThreeBars } from "react-icons/go";

const MainBlock = ({ children, main }) => {
  const [isMenuSmall, setIsMenuSmall] = useState(false);
  const menuClass = isMenuSmall ? "small" : "";
  return (
    <div className={main ? "block main" : `block left ${menuClass}`}>
      <Header
        main={main}
        isMenuSmall={isMenuSmall}
        setIsMenuSmall={setIsMenuSmall}
      />
      <div className="content">{children}</div>
    </div>
  );
};

export default MainBlock;

const Header = ({ main, isMenuSmall, setIsMenuSmall }) => {
  const { screenTitle } = useAdminContext();
  if (main) {
    return (
      <div className="header">
        <span>Админ панель DiCafe</span>
        <span>{" > "}</span>
        <span>{screenTitle}</span>
      </div>
    );
  }
  return (
    <div className="header">
      {isMenuSmall ? (
        <GoThreeBars className="icon" onClick={() => setIsMenuSmall(false)} />
      ) : (
        <GoChevronLeft className="icon" onClick={() => setIsMenuSmall(true)} />
      )}
    </div>
  );
};
