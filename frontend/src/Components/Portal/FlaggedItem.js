const FlaggedItem = ({ item }) => {
  return (
    <div className="flex items-center border p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-24 h-24 object-cover rounded-md"
      />

      {/* Product Details */}
      <div className="ml-4">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-gray-600">Distributed By {item.distributor}</p>
        <p>
          <strong>Cost:</strong> {item.cost}
        </p>
        <p>
          <strong>Average Weight:</strong> {item.weight} LBS
        </p>
        <p>
          <strong>Stock:</strong> {item.stock} quantity
        </p>
      </div>
    </div>
  );
};

export default FlaggedItem;
