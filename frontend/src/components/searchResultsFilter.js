import { useState } from "react";
import { FaFilter } from "react-icons/fa";

const SearchResultsFilter = ({ onFilterSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = (filterType) => {
    onFilterSelect(filterType);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center space-x-2 fond-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filter by</span>
        <FaFilter className="text-xl" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("weight")}
          >
            Weight
          </button>
          <button
            className="block w-full p-2 hover:bg-gray-200"
            onClick={() => handleFilterClick("cost")}
          >
            Cost
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsFilter;
