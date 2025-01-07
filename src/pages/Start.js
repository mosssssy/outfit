import React from "react";
import { useNavigate } from "react-router-dom";

// Start Component
const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Start Page</h1>
      <button
        onClick={() => navigate("/about")}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Go to About Page
      </button>
    </div>
  );
};

export default Start;
