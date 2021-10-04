import React, { useContext, useRef, useState } from "react";

const SceneChangeContext = React.createContext();

const SceneChangeProvider = ({ children }) => {
  const [isCopyOn, setIsCopyOn] = useState(false);
  const [isCartOn, setIsCartOn] = useState(false);

  const cupTargetWrp = useRef(null);
  const cartRef = useRef(null);
  const handleAboutScene = useRef({});
  const handleOrderScene = useRef({});
  const handleDoodleScene = useRef({});
  const handleContactScene = useRef({});
  const handleMainScene = useRef({});
  const handleCupPosChangeRef = useRef(() => {});

  return (
    <SceneChangeContext.Provider
      value={{
        cupTargetWrp,
        handleMainScene,
        handleAboutScene,
        handleOrderScene,
        handleDoodleScene,
        handleContactScene,
        handleCupPosChangeRef,
        isCopyOn,
        setIsCopyOn,
        isCartOn,
        setIsCartOn,
        cartRef,
      }}
    >
      {children}
    </SceneChangeContext.Provider>
  );
};

export const useSceneChangeContext = () => {
  return useContext(SceneChangeContext);
};

export { SceneChangeContext, SceneChangeProvider };
