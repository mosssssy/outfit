import React from "react";
import db from "./firebase";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Start from "./pages/Start";
import About from "./pages/About";
import SelectFashion from "./pages/SelectFashion";
import SelectColor from "./pages/SelectColor";
import Post from "./pages/Post";
import Submitted from "./pages/Submitted";
import Header from "./components/Header";
import Footer from "./components/Footer";
import firebase from "firebase/compat/app";

const Layout = ({ children }) => {
  const location = useLocation();

  // Home 以外のページで Header と Footer を表示
  const hideHeaderFooter = location.pathname === "/";

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        {/* ページごとのルーティング */}
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/about" element={<About />} />
          <Route path="/select-fashion" element={<SelectFashion />} />
          <Route path="/select-color" element={<SelectColor />} />
          <Route path="/post" element={<Post />} />
          <Route path="/submitted" element={<Submitted />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
