import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Contact.css";

const Contact: React.FC = () => {
  return (
    <div className="contact">
      <div>
        <h1>Contact Us</h1>
        <p>Welcome to the contact page</p>
        <div className="contact-link">
          <Link to="about">About</Link>
          <Link to="terms">Terms of Use</Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Contact;
