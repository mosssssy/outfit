import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const NextLink = ({ onClick }) => {
  return (
    <div style={styles.container}>
      <div style={styles.nextLink} onClick={onClick}>
        {/* 適切なパスに遷移 */}
        次へ&nbsp;
        <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // 横並びにする
    justifyContent: "right", // 右に配置
    alignItems: "center", // 垂直方向に中央揃え
    width: "100%",
  },
  nextLink: {
    fontSize: "16px",
    color: "#000000",
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

export default NextLink;
