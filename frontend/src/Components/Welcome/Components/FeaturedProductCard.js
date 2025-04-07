//Import navigation functionality
import { useNavigate } from "react-router-dom";

const FeaturedProductCard = ({ item, imageSrc, productName }) => {
  const navigate = useNavigate();

  const clickView = () => {
    navigate(`/itemview/${item}`);
  };

  return (
    <div className="w-64 h-96 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center p-5 transform hover:scale-105">
      {/* Product Image */}
      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <img className="object-cover w-full h-full" src={imageSrc} alt={productName} />
      </div>

      {/* Product Name */}
      <p className="text-xl font-semibold text-gray-800 mt-3">{productName}</p>

      {/* View Button */}
      <button 
        onClick={clickView} 
        className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
        View Item
      </button>
    </div>
  );
};


export default FeaturedProductCard;
