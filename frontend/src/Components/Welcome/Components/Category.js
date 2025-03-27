import React from "react";
import './Category.css';
const Category = ({ imageSrc, categoryName }) => {
  return (
    <div className="category">
      <p className="category-name">{categoryName}</p>
      <div className="category-circle">
        <img src={imageSrc} alt={categoryName} />
      </div>
    </div>
  );
};

export default Category;