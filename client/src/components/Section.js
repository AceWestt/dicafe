import React from "react";

const Section = ({ className, children, sectionRef }) => {
  return (
    <div
      className={className ? `section ${className}` : "section"}
      ref={sectionRef}
    >
      {children}
    </div>
  );
};

export default Section;
