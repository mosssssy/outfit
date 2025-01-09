import React from "react";
import { useNavigate } from "react-router-dom";

// About Component
const About = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Your Fashion was successfully submitted!</h1>
      <button onClick={() => navigate("/About")} style={styles.button}>
        Go to About Page
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default About;
