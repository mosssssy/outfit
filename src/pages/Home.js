import React, { useEffect, useState } from "react";
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

function Home() {
  const [posts, setPosts] = useState([]); // postsデータを管理
  const [error, setError] = useState(""); // エラーメッセージを管理
  const [users, setUsers] = useState({}); // userIDとusernameをマッピングするオブジェクト
  const [lastVisible, setLastVisible] = useState(null); // 最後に表示されたドキュメントを管理
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const firestore = getFirestore(); // Firestoreインスタンス

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // 最初に20件の投稿を取得する関数
  const fetchPosts = async (startDoc = null) => {
    try {
      setLoading(true);
      const postsCollection = collection(firestore, "posts"); // postsコレクションを参照
      let postsQuery = query(
        postsCollection,
        orderBy("timestamp", "desc"),
        limit(20) // 20件の投稿を取得
      );

      if (startDoc) {
        postsQuery = query(postsQuery, startAfter(startDoc)); // 前回の最後の投稿から次の20件を取得
      }

      const snapshot = await getDocs(postsQuery); // クエリで並べ替えたドキュメントを取得
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントIDを含める
        ...doc.data(), // ドキュメントデータ
      }));

      const usersData = {};
      for (let post of postsData) {
        const userDocRef = doc(firestore, "users", post.userID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          usersData[post.userID] = userDoc.data().username; // usernameを保存
        }
      }

      if (startDoc) {
        setPosts((prevPosts) => [...prevPosts, ...postsData]); // 新しい投稿を追加
      } else {
        setPosts(postsData); // 最初の20件のみ表示
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
    fetchPosts(); // 初回データ取得
  }, [firestore]);

  const renderProcessedImages = (processedFashions) => {
    if (!processedFashions) return null;

    const sortedImages = categoriesOrder
      .filter((category) => processedFashions[category])
      .map((category) => ({
        category,
        imageSrc: processedFashions[category],
      }));

    return (
      <div style={styles.imageContainer}>
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

  return (
    <div style={styles.container}>
      <h2>Home Page</h2>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <div style={styles.postsContainer}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              {renderProcessedImages(post.processedFashions)}
              <h3>{post.title}</h3>
              <p>{users[post.userID]}</p> {/* userIDからusernameを表示 */}
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
      {lastVisible && !loading && posts.length >= 20 ? (
        <Button onClick={() => fetchPosts(lastVisible)} styleType="primary">
          次の20件を表示する
        </Button>
      ) : posts.length > 0 && !loading ? (
        <p>すべての投稿を表示しました</p>
      ) : null}
      {loading && <p>Loading...</p>}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  postsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  postCard: {
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
  errorMessage: { color: "red", fontWeight: "bold" },
};

export default Home;
