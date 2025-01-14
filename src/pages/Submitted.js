import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

// About Component
const About = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Your Fashion was successfully submitted!</h1>
      <Button onClick={() => navigate("/About")} styleType="primary">
        Go to About Page
      </Button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default About;
