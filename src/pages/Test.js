import React, { useState } from "react";

const Tab = ({ id, label, activeTab, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        backgroundColor: activeTab === id ? "lightblue" : "transparent",
        border: "1px solid #ccc",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabContents = [
    { label: "Tab 1", content: "This is the content for Tab 1" },
    { label: "Tab 2", content: "This is the content for Tab 2" },
    { label: "Tab 3", content: "This is the content for Tab 3" },
  ];

  return (
    <div>
      <div style={{ display: "flex" }}>
        {tabContents.map((tab, index) => (
          <Tab
            key={index}
            id={index}
            label={tab.label}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </div>
      <div
        style={{
          padding: "20px",
          marginTop: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        {tabContents[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
