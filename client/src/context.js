import React, { useContext, useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

const AppContext = React.createContext();
const smallScreenBreakPoint = 1024;

const loadingScreenStyle = {
  width: "100%",
  height: "100%",
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const AppProvider = ({ children }) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [lang, setLang] = useState("ru");
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [rendered, setRendered] = useState(false);

  const threeLoadingManager = useProgress();

  const handleResize = () => {
    const wWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (wWidth <= smallScreenBreakPoint) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [smallScreen]);

  if (threeLoadingManager.progress < 100) {
    return (
      <div style={loadingScreenStyle}>
        Loading {threeLoadingManager.progress}%
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        smallScreen,
        lang,
        setLang,
        isMusicOn,
        setIsMusicOn,
        rendered,
        setRendered,
      }}
    >
      {!rendered && (
        <div style={loadingScreenStyle}>
          Loading {threeLoadingManager.progress}%
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
