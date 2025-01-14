import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackLink = ({ onClick }) => {
  return (
    <div style={styles.container}>
      <div style={styles.backLink} onClick={onClick}>
        {/* 適切なパスに遷移 */}
        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrowIcon} />
        戻る
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // 横並びにする
    justifyContent: "left", // 左に配置
    alignItems: "center", // 垂直方向に中央揃え
    width: "100%",
  },
  backLink: {
    fontSize: "16px",
    color: "#8a8787",
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  arrowIcon: {
    marginRight: "8px",
    fontSize: "20px",
  },
};

export default BackLink;
