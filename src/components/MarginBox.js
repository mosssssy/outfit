import React from "react";

const MarginBoxHeight = ({ sizeType = "medium" }) => {
  const size = {
    verysmall: {
      marginBox: {
        height: "4px", // とても小さいサイズの場合の例
      },
    },
    small: {
      marginBox: {
        height: "8px", // 小さいサイズの場合の例
      },
    },
    medium: {
      marginBox: {
        height: "16px", // 中くらいのサイズの場合
      },
    },
    big: {
      marginBox: {
        height: "40px", // 大きいサイズの場合
      },
    },
  };

  return <div style={size[sizeType].marginBox}></div>;
};

export default MarginBoxHeight;
