import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo">My Blog</div>
      <nav>
        <Link to="/">Start</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/posts">Posts</Link>
      </nav>
    </header>
  );
};

export default Header;
