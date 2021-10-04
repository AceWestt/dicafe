import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const maxOpacityValue = 0.8;
let hoverSpeed = 0.025;

export default function Model(props) {
  const {
    cupTarget,
    handleCloseMain,
    handleAboutScene,
    handleOrderScene,
    handleDoodleScene,
    handleContactScene,
    handleCupPosChange,
    labelsActionsRef,
    isCupRotatable,
    targetRotation,
  } = props;

  const { nodes, materials } = useGLTF("/uploads/cup/cup.glb");

  const tempRY = useRef(null);
  const initalMouseX = useRef(null);

  const [doodlesHoverSpeed, setDoodlesHoverSpeed] = useState(0);
  const [orderHoverSpeed, setOrderHoverSpeed] = useState(0);
  const [aboutHoverSpeed, setAboutHoverSpeed] = useState(0);
  const [contactHoverSpeed, setContactHoverSpeed] = useState(0);

  const group = useRef();
  const doodlesHoverMaterial = useRef();
  const orderHoverMaterial = useRef();
  const aboutHoverMaterial = useRef();
  const contactHoverMaterial = useRef();

  const handleHover = (obj, speed) => {
    if (obj.current.opacity >= 0 && obj.current.opacity <= maxOpacityValue) {
      obj.current.opacity += speed;
    }

    if (obj.current.opacity < 0) {
      obj.current.opacity = 0;
    }
    if (obj.current.opacity > maxOpacityValue) {
      obj.current.opacity = maxOpacityValue;
    }
  };

  let rotationSpeed = 0.001;
  let currentMouseX = 0;

  const updateRotation = (state) => {
    if (isCupRotatable.current) {
      if (initalMouseX.current === null) {
        initalMouseX.current = state.mouse.x;
      }
      if (tempRY.current === null) {
        tempRY.current = group.current.rotation.y;
      }
      currentMouseX = state.mouse.x;
      const diff = currentMouseX - initalMouseX.current;
      group.current.rotation.y = tempRY.current + diff;
    } else {
      if (initalMouseX.current !== null) {
        initalMouseX.current = null;
      }
      if (tempRY.current !== null) {
        tempRY.current = null;
      }
      group.current.rotation.y += rotationSpeed;
    }
    if (targetRotation.current) {
      let accSpeed = 0.02;
      const diff = targetRotation.current - group.current.rotation.y;
      if (Math.abs(diff) < 0.05) {
        accSpeed = 0.001;
      } else {
        accSpeed = 0.02;
      }
      if (diff < 0) {
        rotationSpeed = -accSpeed;
      } else if (diff > 0) {
        rotationSpeed = accSpeed;
      } else {
        rotationSpeed = 0;
      }
    } else {
      rotationSpeed = 0.001;
    }
  };

  useFrame((state) => {
    updateRotation(state);
    handleHover(doodlesHoverMaterial, doodlesHoverSpeed);
    handleHover(orderHoverMaterial, orderHoverSpeed);
    handleHover(aboutHoverMaterial, aboutHoverSpeed);
    handleHover(contactHoverMaterial, contactHoverSpeed);
  });

  const handleSceneChange = useCallback(
    (handleOpeningScene) => {
      handleCloseMain().then((res) => {
        handleOpeningScene.open();
        cupTarget.current = handleOpeningScene.cupRef;
        handleCupPosChange();
      });
    },
    [cupTarget, handleCloseMain, handleCupPosChange]
  );

  useEffect(() => {
    if (labelsActionsRef) {
      labelsActionsRef.current = {
        ...labelsActionsRef.current,
        about: {
          ...labelsActionsRef.current.about,
          mouseEnter: () => {
            setAboutHoverSpeed(hoverSpeed);
          },
          mouseLeave: () => {
            setAboutHoverSpeed(-hoverSpeed);
          },
          click: () => {
            handleSceneChange(handleAboutScene);
          },
        },
        order: {
          ...labelsActionsRef.current.order,
          mouseEnter: () => {
            setOrderHoverSpeed(hoverSpeed);
          },
          mouseLeave: () => {
            setOrderHoverSpeed(-hoverSpeed);
          },
          click: () => {
            handleSceneChange(handleOrderScene);
          },
        },
        doodles: {
          ...labelsActionsRef.current.doodles,
          mouseEnter: () => {
            setDoodlesHoverSpeed(hoverSpeed);
          },
          mouseLeave: () => {
            setDoodlesHoverSpeed(-hoverSpeed);
          },
          click: () => {
            handleSceneChange(handleDoodleScene);
          },
        },
        contact: {
          ...labelsActionsRef.current.contact,
          mouseEnter: () => {
            setContactHoverSpeed(hoverSpeed);
          },
          mouseLeave: () => {
            setContactHoverSpeed(-hoverSpeed);
          },
          click: () => {
            handleSceneChange(handleContactScene);
          },
        },
      };
    }
  }, [
    labelsActionsRef,
    handleSceneChange,
    handleAboutScene,
    handleOrderScene,
    handleDoodleScene,
    handleContactScene,
  ]);

  return (
    <group ref={group} {...props} dispose={null} rotation={[0, 0, 0]}>
      <group position={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Line007.geometry}
          material={materials["02 - Default"]}
          position={[0, 0.052, 0]}
          rotation={[Math.PI / 2, 0, 1]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object007.geometry}
          material={nodes.Object007.material}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          onPointerEnter={() => setDoodlesHoverSpeed(hoverSpeed)}
          onPointerOut={() => setDoodlesHoverSpeed(-hoverSpeed)}
          onClick={(e) => {
            handleSceneChange(handleDoodleScene);
          }}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object007.geometry}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          onPointerOver={(e) => {}}
        >
          <meshPhongMaterial
            attach="material"
            color="#FFE600"
            opacity={0}
            transparent
            ref={doodlesHoverMaterial}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object.geometry}
          material={nodes.Object.material}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          onPointerEnter={() => setContactHoverSpeed(hoverSpeed)}
          onPointerOut={() => setContactHoverSpeed(-hoverSpeed)}
          onClick={() => handleSceneChange(handleContactScene)}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object.geometry}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        >
          <meshPhongMaterial
            attach="material"
            color="#FFE600"
            opacity={0}
            transparent
            ref={contactHoverMaterial}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object005.geometry}
          material={nodes.Object005.material}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          onPointerEnter={() => setAboutHoverSpeed(hoverSpeed)}
          onPointerOut={() => setAboutHoverSpeed(-hoverSpeed)}
          onClick={() => {
            handleSceneChange(handleAboutScene);
          }}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object005.geometry}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        >
          <meshPhongMaterial
            attach="material"
            color="#FFE600"
            opacity={0}
            transparent
            ref={aboutHoverMaterial}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object009.geometry}
          material={nodes.Object009.material}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          onPointerEnter={() => setOrderHoverSpeed(hoverSpeed)}
          onPointerOut={() => setOrderHoverSpeed(-hoverSpeed)}
          onClick={() => handleSceneChange(handleOrderScene)}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object009.geometry}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        >
          <meshPhongMaterial
            attach="material"
            color="#FFE600"
            opacity={0}
            transparent
            ref={orderHoverMaterial}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Line008.geometry}
          material={nodes.Line008.material}
          position={[0, -0.03, 0]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/uploads/cup/cup.glb");
