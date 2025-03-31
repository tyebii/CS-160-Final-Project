const Category = ({ imageSrc, categoryName }) => {
  return (
    <div className="flex flex-col items-center text-center mt-5">
      <p className="text-lg font-bold mb-2">{categoryName}</p>
      <div className="p-3 border-2 border-gray-300 rounded-full bg-white shadow-md">
        <img
          src={imageSrc}
          alt={categoryName}
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default Category;
