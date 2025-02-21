import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<number[]>([]);

  useEffect(() => {
    const storedPosts = sessionStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      const newPosts = Array.from({ length: 20 }, (_, i) => i + 1);
      setPosts(newPosts);
      sessionStorage.setItem("posts", JSON.stringify(newPosts));
    }
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((id) => (
          <li key={id}>
            <Link to={`/post/${id}`}>Post {id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
