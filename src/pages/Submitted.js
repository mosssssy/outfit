import React from "react";
import { useNavigate } from "react-router-dom";

// About Component
const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Your Fashion was successfully submitted!</h1>
      <button
        onClick={() => navigate("/About")}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Go to About Page
      </button>
    </div>
  );
};

export default About;
