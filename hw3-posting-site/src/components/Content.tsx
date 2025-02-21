import React from "react";
import "./Content.css";

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="content">
      <main>{children}</main>
    </div>
  );
};

export default Content;
