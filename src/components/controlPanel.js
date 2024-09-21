import React from "react";

//control panel should get signal from backend truck that the truck has started
const ControlPanel = ({ onStartAnimation }) => {
  return (
    <button
      onClick={onStartAnimation}
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Start Animation
    </button>
  );
};

export default ControlPanel;
