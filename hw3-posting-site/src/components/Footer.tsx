import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      <p>
        <a href="/privacy">Privacy Policy</a> |
        <a href="/terms"> Terms of Use</a>
      </p>
    </footer>
  );
};

export default Footer;
