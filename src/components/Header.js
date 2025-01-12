import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // react-iconsから人型アイコンをインポート
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import Button from "./Button";
import { getAuth, signOut } from "firebase/auth"; // Firebase Authのインポート

const Header = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false); // メニューの表示状態を管理
  const auth = getAuth(); // Firebaseの認証インスタンス

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev); // メニューの表示状態を切り替え
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebaseからサインアウト
      console.log("ログアウトしました");
      navigate("/log-in"); // ログアウト後にログインページにリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <header style={styles.header}>
      <Link to="/home" style={styles.logo}>
        OutFit
      </Link>
      <div style={styles.rightContainer}>
        <input type="text" placeholder="検索" style={styles.searchBar} />
        <div
          style={styles.icon}
          onClick={toggleMenu} // アイコンがクリックされた際にメニューを表示/非表示
        >
          <FaUser />
        </div>
        <Button onClick={() => navigate("/select-fashion")} styleType="header">
          ファッションを作る
        </Button>

        {/* メニューが表示されているときのみ表示 */}
        {menuVisible && (
          <div style={styles.menu}>
            <Link to="/my-page" style={styles.menuItem}>
              マイページ
            </Link>
            <Link to="/follow-list" style={styles.menuItem}>
              フォロー一覧
            </Link>
            <Link to="/follower-list" style={styles.menuItem}>
              フォロワー一覧
            </Link>
            <Link to="/good-list" style={styles.menuItem}>
              いいねしたファッション
            </Link>
            <Link to="/settings" style={styles.menuItem}>
              設定
            </Link>
            <Link onClick={handleLogout} style={styles.menuItem}>
              ログアウト
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    padding: "10px 20px",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none", // リンクの下線を消す
    color: "#fff", // ロゴの色を白にする
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative", // メニューを右側に絶対位置で配置
  },
  searchBar: {
    width: "200px",
    margin: "0 10px",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
  },
  icon: {
    fontSize: "1.5rem",
    marginRight: "20px",
    color: "white", // アイコンを白色に
    cursor: "pointer", // アイコンにカーソルを合わせるとポインターに
  },
  menu: {
    position: "absolute", // アイコンの直下に配置
    top: "100%", // アイコンのすぐ下に表示
    right: "0",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    padding: "10px 0",
    zIndex: 9999, // 最前面に表示するためにz-indexを設定
    // opacity: menuVisible ? 1 : 0, // メニューが表示されるときにフェードイン
    // transform: menuVisible ? "translateY(0)" : "translateY(-10px)", // メニューが表示されるときにスライドダウン
    // transition: "opacity 0.3s ease, transform 0.3s ease", // アニメーションを追加
  },
  menuItem: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 20px",
    display: "block",
    fontSize: "14px",
  },
  menuItemHover: {
    backgroundColor: "#444", // メニュー項目のホバー時の背景色
  },
};

export default Header;
