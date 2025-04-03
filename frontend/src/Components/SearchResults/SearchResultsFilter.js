import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useAuth } from "../../Context/AuthHook";

const SearchResultsFilter = ({ onFilterSelect }) => {
  const { auth } = useAuth();
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
          {/* Additional filters for employees & managers */}
          {(auth === "Employee" || auth === "Manager") && (
            <>
              <button
                className="block w-full p-2 hover:bg-gray-200"
                onClick={() => handleFilterClick("Low to High Stock")}
              >
                Low to High Stock
              </button>
              <button
                className="block w-full p-2 hover:bg-gray-200"
                onClick={() => handleFilterClick("High to Low Stock")}
              >
                High to Low Stock
              </button>
              <button
                className="block w-full p-2 hover:bg-gray-200"
                onClick={() => handleFilterClick("Name")}
              >
                Name (A-Z)
              </button>
              <button
                className="block w-full p-2 hover:bg-gray-200"
                onClick={() => handleFilterClick("Expiration")}
              >
                Expiration Date
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsFilter;
