import React from "react";

// ボタンのスタイルを共通化
const Button = ({ onClick, children, styleType = "primary" }) => {
  const buttonStyles = {
    primary: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      margin: "10px",
      cursor: "pointer",
      fontSize: "16px",
    },
    secondary: {
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      margin: "10px",
      cursor: "pointer",
      fontSize: "16px",
    },
    danger: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      margin: "10px",
      cursor: "pointer",
      fontSize: "16px",
    },
    header: {
      backgroundColor: "#fff",
      color: "#000",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    // 他にもボタンのスタイルを追加可能
  };

  return (
    <button onClick={onClick} style={buttonStyles[styleType]}>
      {children}
    </button>
  );
};

export default Button;
