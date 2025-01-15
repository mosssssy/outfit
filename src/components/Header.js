import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch } from "react-icons/fa"; // react-iconsから人型アイコンをインポート
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import Button from "./Button";
import { getAuth, signOut } from "firebase/auth"; // Firebase Authのインポート
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"; // Firestoreインポート

const Header = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false); // メニューの表示状態を管理
  const menuRef = useRef(null); // メニューを参照するためのref
  const iconRef = useRef(null); // メニューアイコンを参照するためのref
  const auth = getAuth(); // Firebaseの認証インスタンス
  const [searchQuery, setSearchQuery] = useState(""); // 検索バーの入力値

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return; // 入力が空でない場合のみ検索を実行
    const db = getFirestore();
    const fashionCollection = collection(db, "fashions");
    const q = query(
      fashionCollection,
      where("title", ">=", searchQuery),
      where("title", "<=", searchQuery + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const searchResults = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    navigate("/search", { state: { results: searchResults } }); // 検索結果を`/search`に遷移
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // エンターキーが押されたら検索を実行
      handleSearch();
    }
  };

  // メニューを表示/非表示にする
  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  // メニュー外クリックで閉じる処理
  const handleClickOutside = (e) => {
    // メニューやメニューアイコンがクリックされた場合は閉じない
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      !iconRef.current.contains(e.target)
    ) {
      setMenuVisible(false); // メニュー外をクリックした場合に閉じる
    }
  };

  // 画面遷移時にメニューを閉じる
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebaseからサインアウト
      console.log("ログアウトしました");
      navigate("/log-in"); // ログアウト後にログインページにリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  // useEffectでクリックイベントをリスン
  useEffect(() => {
    // メニュー外クリックでメニューを閉じる
    document.addEventListener("click", handleClickOutside);

    // クリーンアップ
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header style={styles.header}>
      <Link to="/home" style={styles.logo}>
        OutFit
      </Link>
      <div style={styles.rightContainer}>
        <input
          type="text"
          placeholder="検索"
          style={styles.searchBar}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <FaSearch
          style={styles.searchIcon}
          onClick={handleSearch} // アイコンがクリックされたときに検索を実行
        />
        <div
          ref={iconRef} // メニューアイコンの参照を追加
          style={styles.userIcon}
          onClick={toggleMenu} // アイコンがクリックされた際にメニューを表示/非表示
        >
          <FaUser />
        </div>
        <Button onClick={() => navigate("/select-fashion")} styleType="header">
          ファッションを作る
        </Button>

        {/* メニューが表示されているときのみ表示 */}
        {menuVisible && (
          <div ref={menuRef} style={styles.menu}>
            <Link onClick={toggleMenu} to="/my-page" style={styles.menuItem}>
              マイページ
            </Link>
            <Link
              onClick={toggleMenu}
              to="/follow-list"
              style={styles.menuItem}
            >
              フォロー一覧
            </Link>
            <Link
              onClick={toggleMenu}
              to="/follower-list"
              style={styles.menuItem}
            >
              フォロワー一覧
            </Link>
            <Link onClick={toggleMenu} to="/good-list" style={styles.menuItem}>
              いいねしたファッション
            </Link>
            <Link onClick={toggleMenu} to="/settings" style={styles.menuItem}>
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
    padding: "16px 24px",
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
    minWidth: "200px",
    maxWidth: "400px",
    margin: "0 5px",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
  },
  searchIcon: {
    fontSize: "1rem",
    color: "#fff",
    cursor: "pointer",
    marginRight: "20px",
  },
  userIcon: {
    fontSize: "1.5rem",
    marginRight: "20px",
    color: "white", // アイコンを白色に
    cursor: "pointer", // アイコンにカーソルを合わせるとポインターに
  },
  menu: {
    position: "absolute", // アイコンの直下に配置
    top: "125%", // アイコンのすぐ下に表示
    right: "2.5%",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    padding: "10px 0",
    zIndex: 9999, // 最前面に表示するためにz-indexを設定
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
