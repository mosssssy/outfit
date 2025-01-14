import React from "react";

const ErrorContainer = ({
  error,
  sizeType = "big",
  justifyContentType = "center",
}) => {
  const size = {
    big: {
      errorContainer: {
        height: "64px",
      },
    },
    small: {
      errorContainer: {
        height: "16px",
      },
    },
  };

  const justifyContent = {
    center: {
      errorContainer: {
        justifyContent: "center", // 中央揃え
      },
    },
    left: {
      errorContainer: {
        justifyContent: "left", // 左揃え
      },
    },
  };

  return (
    <div
      style={{
        ...styles.errorContainer,
        ...size[sizeType].errorContainer,
        ...justifyContent[justifyContentType].errorContainer,
      }}
    >
      {error ? (
        <p style={styles.errorMessage}>{error}</p>
      ) : (
        <div style={styles.marginBox}></div>
      )}
    </div>
  );
};

const styles = {
  errorContainer: {
    display: "flex",
    alignItems: "center", // 縦位置を中央に揃える
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center", // テキストを中央揃え
  },
  marginBox: {
    width: "100%",
  },
};

export default ErrorContainer;
