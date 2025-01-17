import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function GoodList() {
  const navigate = useNavigate();
  const [fashions, setFashions] = useState([]);
  const [likedFashions, setLikedFashions] = useState({});
  const [userId, setUserId] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const firestore = getFirestore();
  const modelFashion = "/assets/model_01.png";
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"];

  const getCurrentUserId = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      setUserId(userId);
      fetchLikedFashions(userId);
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = {};
      usersSnapshot.docs.forEach((doc) => {
        const { username } = doc.data();
        usersData[doc.id] = username;
      });
      setUsers(usersData);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const userId = getCurrentUserId();
      if (userId) {
        setUserId(userId);
        setLoading(true); // ローディング開始
        await fetchLikedFashions(userId); // 非同期処理を待つ
        await fetchUsers(); // ユーザー情報も待つ
        setLoading(false); // ローディング終了
      }
    };

    initialize();
  }, []);

  const fetchLikedFashions = async (userId) => {
    setLoading(true); // ローディング開始
    try {
      const likesCollection = collection(firestore, "likes");
      const likesSnapshot = await getDocs(likesCollection);
      const likedFashionIds = [];

      likesSnapshot.docs.forEach((doc) => {
        const { userId: docUserId, fashionId, liked } = doc.data();
        if (docUserId === userId && liked) {
          likedFashionIds.push(fashionId);
        }
      });

      if (likedFashionIds.length === 0) {
        setFashions([]); // 明示的に空リストを設定
        return;
      }

      const fashionsCollection = collection(firestore, "fashions");
      const queryRef = lastDoc
        ? query(fashionsCollection, startAfter(lastDoc), limit(10))
        : query(fashionsCollection, limit(10));

      const fashionsSnapshot = await getDocs(queryRef);
      const lastVisible =
        fashionsSnapshot.docs[fashionsSnapshot.docs.length - 1];

      const fashionsData = fashionsSnapshot.docs
        .filter((doc) => likedFashionIds.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      setFashions((prev) => {
        const uniqueFashions = [...prev, ...fashionsData].reduce(
          (acc, fashion) => {
            if (!acc.some((item) => item.id === fashion.id)) {
              acc.push(fashion);
            }
            return acc;
          },
          []
        );
        return uniqueFashions;
      });

      setLastDoc(lastVisible);

      const likedFashionsState = {};
      likedFashionIds.forEach((id) => {
        likedFashionsState[id] = true;
      });

      setLikedFashions(likedFashionsState);
    } catch (error) {
      console.error("いいねしたファッションの取得に失敗しました:", error);
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  const toggleLike = async (fashionId) => {
    const currentLikedState = likedFashions[fashionId];
    const newLikedState = !currentLikedState;

    setLikedFashions((prev) => ({
      ...prev,
      [fashionId]: newLikedState,
    }));

    try {
      await setDoc(doc(firestore, "likes", `${userId}_${fashionId}`), {
        userId,
        fashionId,
        liked: newLikedState,
      });

      if (currentLikedState !== true) {
        toast.success("ファッションをいいねしました！", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "custom-toast", // カスタムクラスを指定
        });
      }
    } catch (error) {
      console.error("Firestoreにいいねデータを保存できませんでした:", error);
    }
  };

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
        onClick={(e) => handleFashionClick(e, fashionId)}
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
        <FaHeart
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(fashionId);
          }}
          style={{
            ...styles.heartIcon,
            color: likedFashions[fashionId] ? "#ee2a7b" : "#ffffff",
            stroke: likedFashions[fashionId] ? "none" : "#000000",
            strokeWidth: likedFashions[fashionId] ? "0" : "4",
          }}
        />
      </div>
    );
  };

  const handleFashionClick = (e, fashionId) => {
    e.preventDefault();
    navigate(`/fashion-detail/${fashionId}`);
  };

  const handleUserClick = (e, userId) => {
    e.preventDefault();
    navigate(`/user-detail/${userId}`);
  };

  return (
    <div style={styles.container}>
      <h1>いいねしたファッション</h1>
      <div style={styles.fashionsContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : fashions.length > 0 ? (
          fashions.map((fashion) => (
            <div key={fashion.id} style={styles.fashionCard}>
              {renderProcessedImages(fashion.processedFashions, fashion.id)}
              <p
                onClick={(e) => handleFashionClick(e, fashion.id)}
                style={styles.title}
              >
                {fashion.title.length > 10
                  ? `${fashion.title.slice(0, 10)}…`
                  : fashion.title}
              </p>
              <p
                onClick={(e) => handleUserClick(e, fashion.userID)}
                style={styles.name}
              >
                {users[fashion.userID] || "Unknown User"}
              </p>
            </div>
          ))
        ) : (
          <p>いいねしたファッションはありません</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
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
  heartIcon: {
    position: "absolute",
    bottom: "-40px",
    right: "10px",
    fontSize: "24px",
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
  title: {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  name: { color: "black", textDecoration: "underline", cursor: "pointer" },
};

export default GoodList;
