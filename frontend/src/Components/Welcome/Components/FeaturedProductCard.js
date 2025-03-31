const FeaturedProductCard = ({ imageSrc, productName }) => {
  return (
    <div className="w-52 h-72 border-2 border-gray-300 rounded-xl text-center p-4 bg-white shadow-md flex flex-col items-center">
      <img className="w-40 h-40 object-cover mb-3" src={imageSrc} alt={productName} />
      <p className="text-lg font-bold mb-2">{productName}</p>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition duration-200">
        View Item
      </button>
    </div>
  );
};

export default FeaturedProductCard;
