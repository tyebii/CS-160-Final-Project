//Import React Function
import { useState } from "react";

//Import Filter Icon
import { FaFilter } from "react-icons/fa";

//Filter Component
const SearchResultsFilter = ({ onFilterSelect }) => {

  //Is The Filter Dropdown Visible
  const [isOpen, setIsOpen] = useState(false);

  //When The Dropdown Items Of The Filter Are Clicked
  const handleFilterClick = (filterType) => {
    onFilterSelect(filterType);
    setIsOpen(false);
  };

  //HTML
  return (
    <div className="relative inline-block">
      {/* Filter Description And Icon */}
      <button
        className="flex items-center space-x-2 fond-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filter by</span>
        <FaFilter className="text-xl" />
      </button>
      {/* Dropdown Items */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("Low to High Weight")}
          >
            Low to High Weight
          </button>
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("High to Low Weight")}
          >
            High to Low Weight
          </button>
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("Low to High Cost")}
          >
            Low to High Cost
          </button>
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("High to Low Cost")}
          >
            High to Low Cost
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsFilter;
