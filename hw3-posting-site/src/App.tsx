import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./components/Content";
import Start from "./pages/Start";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Content>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/contact" element={<Contact />}>
            <Route path="about" element={<About />} />
            <Route path="terms" element={<Terms />} />
          </Route>
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Content>
      <Footer />
    </Router>
  );
};

export default App;
