import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
  startAfter,
  limit,
} from "firebase/firestore";
import Button from "../components/Button";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = location.state || {}; // 検索結果を受け取る
  const [fashions, setFashions] = useState([]); // fashionsデータを管理
  const [error, setError] = useState(""); // エラーメッセージを管理
  const [users, setUsers] = useState({}); // userIDとusernameをマッピングするオブジェクト
  const [lastVisible, setLastVisible] = useState(null); // 最後に表示されたドキュメントを管理
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const firestore = getFirestore(); // Firestoreインスタンス

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // 最初に20件の投稿を取得する関数
  const fetchFashions = async (startDoc = null) => {
    try {
      setLoading(true);
      const fashionsCollection = collection(firestore, "fashions"); // fashionsコレクションを参照
      let fashionsQuery = query(
        fashionsCollection,
        orderBy("timestamp", "desc"),
        limit(20) // 20件の投稿を取得
      );

      if (startDoc) {
        fashionsQuery = query(fashionsQuery, startAfter(startDoc)); // 前回の最後の投稿から次の20件を取得
      }

      const snapshot = await getDocs(fashionsQuery); // クエリで並べ替えたドキュメントを取得
      const fashionsData = snapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントIDを含める
        ...doc.data(), // ドキュメントデータ
      }));

      const usersData = {};
      for (let fashion of fashionsData) {
        const userDocRef = doc(firestore, "users", fashion.userID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          usersData[fashion.userID] = userDoc.data().username; // usernameを保存
        }
      }

      if (startDoc) {
        setFashions((prevFashions) => [...prevFashions, ...fashionsData]); // 新しい投稿を追加
      } else {
        setFashions(fashionsData); // 最初の20件のみ表示
      }

      setUsers(usersData); // usersを更新
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // 最後のドキュメントを更新
      setLoading(false);

      // もし取得した投稿数が20件未満だった場合、ボタンを非表示にする
      if (snapshot.docs.length < 20) {
        setLastVisible(null); // 最後のドキュメントがない状態にする
      }
    } catch (error) {
      console.error("Firestoreからデータを取得できませんでした:", error);
      setError("データの取得に失敗しました");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFashions(); // 初回データ取得
  }, [firestore]);

  const renderProcessedImages = (processedFashions, fashionId) => {
    if (!processedFashions) return null;

    const sortedImages = categoriesOrder
      .filter((category) => processedFashions[category])
      .map((category) => ({
        category,
        imageSrc: processedFashions[category],
      }));

    return (
      <div
        onClick={() => handleFashionClick(fashionId)}
        style={styles.imageContainer}
      >
        <img src={modelFashion} alt="Model" style={styles.modelImage} />
        {sortedImages.map(({ category, imageSrc }, index) => (
          <img
            key={category}
            src={imageSrc}
            alt={category}
            style={{
              ...styles.categoryImage,
              zIndex: index + 2,
            }}
          />
        ))}
      </div>
    );
  };

  const handleFashionClick = (fashionId) => {
    navigate(`/fashion-detail/${fashionId}`); // 選択された投稿の詳細ページに遷移
  };

  return (
    <div style={styles.container}>
      <h1>検索結果</h1>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <div style={styles.fashionsContainer}>
        {results.length > 0 ? (
          results.map((fashion) => (
            <div key={fashion.id} style={styles.fashionCard}>
              {renderProcessedImages(fashion.processedFashions, fashion.id)}
              <p
                onClick={() => handleFashionClick(fashion.id)}
                style={styles.title}
              >
                {fashion.title.length > 10
                  ? `${fashion.title.slice(0, 10)}…`
                  : fashion.title}
              </p>
              <Link to="/user-detail" style={styles.username}>
                {users[fashion.userID]}
              </Link>{" "}
              {/* userIDからusernameを表示 */}
            </div>
          ))
        ) : (
          <p>検索結果がありません</p>
        )}
      </div>
      {lastVisible && !loading && results.length >= 20 ? (
        <Button onClick={() => fetchFashions(lastVisible)} styleType="primary">
          次の20件を表示する
        </Button>
      ) : results.length > 0 && !loading ? (
        <p>すべての投稿を表示しました</p>
      ) : null}
      {loading && <p>Loading...</p>}
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
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
    marginBottom: "10px",
    cursor: "pointer",
  },
  modelImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "240px",
    height: "420px",
    zIndex: 0,
  },
  categoryImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "240px",
    height: "420px",
  },
  smallText: { fontSize: "12px", color: "#555" },
  title: {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  username: { color: "black", textDecoration: "underline" },
  errorMessage: { color: "red", fontWeight: "bold" },
};

export default Search;
