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
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn_"; // エラー回避
import PasswordResetEmail from "./pages/PasswordResetEmail";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
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

  // Header と Footer を非表示にするパスを配列で定義
  const pathsToHideHeaderFooter = [
    "/",
    "/sign-up",
    "/log-in",
    "/password-reset-email",
    "/password-reset",
    "/password-reset-success",
  ];

  // 現在のパスが非表示対象かを判定
  const hideHeaderFooter = pathsToHideHeaderFooter.includes(location.pathname);

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
          <Route path="/" element={<Start />} /> {/* スタート画面 */}
          <Route path="/sign-up" element={<SignUp />} /> {/* 新規登録画面 */}
          <Route path="/log-in" element={<LogIn />} /> {/* ログイン画面 */}
          <Route
            path="/password-reset-email"
            element={<PasswordResetEmail />}
          />
          {/* パスワード再設定用メール送信画面 */}
          <Route path="/password-reset" element={<PasswordReset />} />
          {/* パスワード再設定画面 */}
          <Route
            path="/password-reset-success"
            element={<PasswordResetSuccess />}
          />
          {/* パスワード再設定成功画面 */}
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
