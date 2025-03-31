import React from "react";
import './Category.css';
const Robots = ({ imageSrc, robotName }) => {
  return (
    <div className="category">
      <div className="robot-square">
        <img src={imageSrc} alt={robotName} className="robot-image"/>
        <p className="robot-name">{robotName}</p>
        <button className="view-more">View</button>
      </div>
    </div>
  );
};

export default Robots;