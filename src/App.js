import React from "react";
// import db from "./firebase";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Start from "./pages/Start";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn_"; // エラー回避
import PasswordResetEmail from "./pages/PasswordResetEmail";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import Home from "./pages/Home";
import FashionDetail from "./pages/FashionDetail";
import UserDetail from "./pages/UserDetail";
import Search from "./pages/Search";
import MyPage from "./pages/MyPage";
import FollowList from "./pages/FollowList";
import FollowerList from "./pages/FollowerList";
import GoodList from "./pages/GoodList";
import Settings from "./pages/Settings";
import MyPageEdit from "./pages/MyPageEdit";
import EmailReset from "./pages/EmailReset";
import EmailResetSuccess from "./pages/EmailResetSuccess";
import DeleteConfirm from "./pages/DeleteConfirm";
import DeleteSuccess from "./pages/DeleteSuccess";
import SelectFashion from "./pages/SelectFashion";
import SelectColor from "./pages/SelectColor";
import Post from "./pages/Post";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import firebase from "firebase/compat/app";

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
          <Route path="/home" element={<Home />} /> {/* ホーム画面 */}
          <Route
            path="/fashion-detail/:fashionId"
            element={<FashionDetail />}
          />{" "}
          {/* ファッション詳細画面 */}
          <Route path="/user-detail/:userId" element={<UserDetail />} />{" "}
          {/* ユーザー詳細画面 */}
          <Route path="/search" element={<Search />} /> {/* 検索結果画面 */}
          <Route path="/my-page" element={<MyPage />} /> {/* マイページ画面 */}
          <Route path="/follow-list" element={<FollowList />} />{" "}
          {/* フォロー一覧画面 */}
          <Route path="/follower-list" element={<FollowerList />} />{" "}
          {/* フォロワー一覧画面 */}
          <Route path="/good-list" element={<GoodList />} />{" "}
          {/* いいね一覧画面 */}
          <Route path="/settings" element={<Settings />} /> {/* 設定画面 */}
          <Route path="/my-page-edit" element={<MyPageEdit />} />{" "}
          {/* マイページ編集画面 */}
          <Route path="/email-reset" element={<EmailReset />} />{" "}
          {/* メールアドレス再設定画面 */}
          <Route
            path="/email-reset-success"
            element={<EmailResetSuccess />}
          />{" "}
          {/* メールアドレス再設定成功画面 */}
          <Route path="/delete-confirm" element={<DeleteConfirm />} />{" "}
          {/* 退会確認画面 */}
          <Route path="/delete-success" element={<DeleteSuccess />} />{" "}
          {/* 退会成功画面 */}
          <Route path="/select-fashion" element={<SelectFashion />} />{" "}
          {/* コーデ作成画面（1. 服装選択画面） */}
          <Route path="/select-color" element={<SelectColor />} />{" "}
          {/* コーデ作成画面（2. 色選択画面） */}
          <Route path="/post" element={<Post />} />{" "}
          {/* コーデ作成画面（3. 情報登録画面） */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
