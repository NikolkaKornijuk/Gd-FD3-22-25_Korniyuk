import React from "react";
import { useParams, Navigate } from "react-router-dom";

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const isValidId = (id: string | undefined) => {
    return id ? /^\d+$/.test(id) : false;
  };

  if (!isValidId(id)) {
    return <Navigate to="/not-found" />;
  }

  return (
    <div>
      <h1>Post ID: {id}</h1>
      <p>Content for post {id} goes here.</p>
    </div>
  );
};

export default Post;
