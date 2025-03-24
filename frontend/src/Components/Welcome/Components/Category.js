import React from "react";
import './Category.css';
const Category = ({ imageSrc, categoryName }) => {
  return (
    <div className="category">
      <div className="category-circle">
        <img src={imageSrc} alt={categoryName} />
      </div>
      <p className="category-name">{categoryName}</p>
      <button className="view-more">View More</button>
    </div>
  );
};

export default Category;