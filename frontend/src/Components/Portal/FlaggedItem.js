//Import navigation functionality
import { useNavigate } from "react-router-dom";

const FlaggedItem = ({ item, robots }) => {

  const navigate = useNavigate();

  if (item != null) {

    return (

      <div onClick = {()=>{navigate(`/itemview/${item.ItemID}`)}} className="flex items-center border p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
  
        {/* Product Details */}
        <div className="ml-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-2">Item ID: {item.ItemID}</h3>

          <p className="text-sm text-gray-500">Date of Event Add: {item.EventDate}</p>

        </div>
  
        {/* Optional: Flag Icon or Badge */}

        <div className="ml-auto flex items-center justify-center w-10 h-10 bg-yellow-200 rounded-full shadow-md text-gray-700">

          <span className="text-xl font-semibold">!</span>

        </div>

      </div>

    );

  }else{

    return (

      <div onClick = {()=>{navigate(`/`)}} className="flex items-center border p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
  
        {/* Product Details */}
        <div className="ml-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-2">Robot ID: {robots.RobotID}</h3>

          <p className="text-sm text-gray-500">Date of Event Add: {robots.EventDate}</p>

        </div>
  
        {/* Optional: Flag Icon or Badge */}

        <div className="ml-auto flex items-center justify-center w-10 h-10 bg-yellow-200 rounded-full shadow-md text-gray-700">

          <span className="text-xl font-semibold">!</span>

        </div>

      </div>

    );
    
  }

};

export default FlaggedItem;
