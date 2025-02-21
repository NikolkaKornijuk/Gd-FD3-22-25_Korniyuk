import React from "react";
import { Link } from "react-router-dom";

const Start: React.FC = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>
        Here you will find many interesting articles on various topics. We
        discuss technology, science, art and much more.
      </p>
      <h2>New posts</h2>
      <p>Follow our new publications and don't forget to leave comments!</p>
      <Link to="/posts">Go to posts</Link>
    </div>
  );
};

export default Start;
