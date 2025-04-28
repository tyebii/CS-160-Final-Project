import { useState } from "react";

import { FaFilter } from "react-icons/fa";

//Filter Component
const SearchResultsFilter = ({ onFilterSelect }) => {

  const [isOpen, setIsOpen] = useState(false);

  //When The Dropdown Items Of The Filter Are Clicked
  const handleFilterClick = (filterType) => {

    onFilterSelect(filterType);

    setIsOpen(false);

  };

  return (

    <div className="relative inline-block">

      {/* Filter Description And Icon */}
      <button

        className="flex items-center space-x-2 fond-bold"

        onClick={()=>{setIsOpen(!isOpen)}}

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

            Weight Ascending

          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("High to Low Weight")}

          >

            Weight Descending

          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("Low to High Cost")}

          >

            Cost Ascending

          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("High to Low Cost")}

          >

            Cost Descending

          </button>

        </div>

      )}

    </div>

  );
  
};

export default SearchResultsFilter;
