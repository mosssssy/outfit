import React from "react";
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
import Test from "./pages/Test";
import Header from "./components/Header";
import Footer from "./components/Footer";

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

// App Component
const App = () => {
  return (
    <Router>
      <Layout>
        {/* ページごとのルーティング */}
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/about" element={<About />} />
          <Route path="/selectFashion" element={<SelectFashion />} />
          <Route path="/selectColor" element={<SelectColor />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
