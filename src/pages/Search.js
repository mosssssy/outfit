import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import Button from "../components/Button";

const Search = () => {
  const location = useLocation();
  const { results } = location.state || {}; // 検索結果を受け取る

  if (!results) return <div>検索結果がありません</div>;

  return (
    <div style={styles.container}>
      <h1>検索結果</h1>
      <div style={styles.fashionsContainer}>
        {results.map((fashion) => (
          <div key={fashion.id} style={styles.fashionCard}>
            <div style={styles.imageContainer}>
              <img
                src={fashion.image}
                alt={fashion.title}
                style={styles.modelImage}
              />
            </div>
            <p style={styles.title}>{fashion.title}</p>
            <Link to={`/fashion-detail/${fashion.id}`} style={styles.username}>
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
      {results.length === 0 && <p>一致する結果はありません</p>}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  fashionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  fashionCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px",
    width: "240px",
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    position: "relative",
    width: "240px",
    height: "420px",
    marginBottom: "10px",
    backgroundColor: "#D3D3D3",
  },
  modelImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  username: { color: "black", textDecoration: "underline" },
};

export default Search;
