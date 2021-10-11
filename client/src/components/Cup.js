import React, { Suspense, useRef, useEffect, useCallback } from "react";
import cupImg from "./imgs/cup.png";
import rotateHint from "../pages/imgs/main/cupRotateHint.svg";
import { Canvas } from "@react-three/fiber";
import CupModel from "./CupModel";
import { OrbitControls } from "@react-three/drei";
import { useAppContext } from "../context";
import { useSceneChangeContext } from "../sceneChangeContext";
import { getCoords } from "../utils/utils";

const Cup = ({
  handleCloseMain,
  rotateHintRef,
  labelsActionsRef,
  targetRotation,
}) => {
  const { setRendered, smallScreen } = useAppContext();
  const cupModelWrp = useRef(null);

  const isCupRotatable = useRef(false);

  const {
    cupTargetWrp,
    handleMainScene,
    handleAboutScene,
    handleOrderScene,
    handleDoodleScene,
    handleContactScene,
    handleCupPosChangeRef,
  } = useSceneChangeContext();

  const handleCupPosChange = useCallback(() => {
    if (
      cupModelWrp &&
      cupTargetWrp &&
      cupModelWrp.current &&
      cupTargetWrp.current
    ) {
      const cupModel = cupModelWrp.current;
      const targetx = getCoords(cupTargetWrp.current).left;
      const targety = getCoords(cupTargetWrp.current).top;
      cupModel.style.left = `${targetx}px`;
      cupModel.style.top = `${targety}px`;
      if (smallScreen) {
        const targetw = cupTargetWrp.current.offsetWidth;
        const targeth = cupTargetWrp.current.offsetHeight;
        cupModel.style.width = `${targetw}px`;
        cupModel.style.height = `${targeth}px`;
      }
    }
  }, [cupTargetWrp, smallScreen]);

  useEffect(() => {
    handleCupPosChangeRef.current = () => {
      handleCupPosChange();
    };
  }, [handleCupPosChange, handleCupPosChangeRef]);

  useEffect(() => {
    handleCupPosChange();
  }, [handleCupPosChange]);

  return (
    <div
      className="cup-wrp"
      ref={(e) => {
        handleMainScene.current = { ...handleMainScene.current, cupRef: e };
        cupTargetWrp.current = e;
      }}
    >
      <img src={cupImg} alt="cup" className="cup-img" />
      <div
        className="cup-model-wrp"
        ref={cupModelWrp}
        onMouseDown={() => {
          isCupRotatable.current = true;
        }}
        onTouchStart={() => {
          isCupRotatable.current = true;
        }}
        onMouseUp={() => {
          isCupRotatable.current = false;
        }}
        onTouchEnd={() => {
          isCupRotatable.current = false;
        }}
        onMouseLeave={() => {
          isCupRotatable.current = false;
        }}
      >
        <Canvas
          className="cup-canvas"
          dpr={2}
          camera={{
            fov: 20,
            position: [0, 0.08, 0.45],
            near: 0.1,
            far: 1000,
          }}
          onCreated={() => {
            setRendered(true);
          }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 18]} angle={1} />
          <Suspense fallback={null}>
            <CupModel
              cupTarget={cupTargetWrp}
              handleCupPosChange={handleCupPosChange}
              handleCloseMain={handleCloseMain}
              handleAboutScene={handleAboutScene.current}
              handleOrderScene={handleOrderScene.current}
              handleDoodleScene={handleDoodleScene.current}
              handleContactScene={handleContactScene.current}
              labelsActionsRef={labelsActionsRef}
              isCupRotatable={isCupRotatable}
              targetRotation={targetRotation}
            />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={false}
            autoRotateSpeed={1}
            enableRotate={false}
            maxPolarAngle={Math.PI / 2.25}
            minPolarAngle={Math.PI / 2.25}
          />
        </Canvas>
      </div>
      <div className="rotate-hint">
        <img src={rotateHint} ref={rotateHintRef} alt="rotate hint" />
      </div>
    </div>
  );
};

export default Cup;
