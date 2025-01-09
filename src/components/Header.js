import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // react-iconsから人型アイコンをインポート
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート

const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <Link to="/home" style={styles.logo}>
        OutFit
      </Link>{" "}
      <div style={styles.rightContainer}>
        <input type="text" placeholder="検索" style={styles.searchBar} />
        <div style={styles.icon}>
          <FaUser /> {/* インポートした人型アイコンを表示 */}
        </div>
        <button
          onClick={() => navigate("/select-fashion")}
          style={styles.button}
        >
          ファッションを作る
        </button>
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
  },
  button: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;
