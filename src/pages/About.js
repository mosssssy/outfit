import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

// About Component
const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>About Page</h1>
      <Button onClick={() => navigate("/select-fashion")} styleType="primary">
        Go to Select Fashion Page
      </Button>
    </div>
  );
};

export default About;
