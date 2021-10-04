import React from "react";

const BgWithElements = ({ children, bgRef }) => {
  return (
    <div className="bg-with-elements" ref={bgRef}>
      {children}
    </div>
  );
};

export default BgWithElements;
