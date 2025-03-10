import React from "react";

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