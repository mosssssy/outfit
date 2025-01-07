import React from "react";
import { useNavigate } from "react-router-dom";

// About Component
const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>About Page</h1>
      <button
        onClick={() => navigate("/SelectFashion")}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Go to Select Fashion Page
      </button>
      <br></br>
      <button
        onClick={() => navigate("/test")}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Go to Test Page
      </button>
    </div>
  );
};

export default About;
