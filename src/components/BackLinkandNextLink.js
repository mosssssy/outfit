import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const BackLinkandNextLink = ({ backOnClick, nextOnClick }) => {
  return (
    <div style={styles.container}>
      <div style={styles.backLink} onClick={backOnClick}>
        {/* 適切なパスに遷移 */}
        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrowIcon} />
        戻る
      </div>
      <div style={styles.nextLink} onClick={nextOnClick}>
        {/* 適切なパスに遷移 */}
        次へ&nbsp;{" "}
        <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // 横並びにする
    justifyContent: "space-between", // 左右に配置
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

export default BackLinkandNextLink;
