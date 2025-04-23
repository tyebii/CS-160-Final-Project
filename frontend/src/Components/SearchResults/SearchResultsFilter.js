//Import React Function
import { useState } from "react";

//Import Filter Icon
import { FaFilter } from "react-icons/fa";
import { useAuth } from "../../Context/AuthHook";

//Filter Component
const SearchResultsFilter = ({ onFilterSelect }) => {
<<<<<<< HEAD

=======
  const { auth } = useAuth();
>>>>>>> 504fc45f87682bb2b3ac155eabc1fed172ae9ea7
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
<<<<<<< HEAD

            Low to High Weight

=======
            Low to High Weight
>>>>>>> 504fc45f87682bb2b3ac155eabc1fed172ae9ea7
          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("High to Low Weight")}

          >
<<<<<<< HEAD

            High to Low Weight

=======
            High to Low Weight
>>>>>>> 504fc45f87682bb2b3ac155eabc1fed172ae9ea7
          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("Low to High Cost")}

          >
<<<<<<< HEAD

            Low to High Cost

=======
            Low to High Cost
>>>>>>> 504fc45f87682bb2b3ac155eabc1fed172ae9ea7
          </button>

          <button

            className="block w-full p-2 hover:bg-gray-200"

            onClick={() => handleFilterClick("High to Low Cost")}

          >
<<<<<<< HEAD

            High to Low Cost

          </button>

=======
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
>>>>>>> 504fc45f87682bb2b3ac155eabc1fed172ae9ea7
        </div>

      )}

    </div>

  );
  
};

export default SearchResultsFilter;
