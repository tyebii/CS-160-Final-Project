const SearchResultsItem = ({ result }) => {
  return (
    <div className="flex items-center border p-4 bg-white rounded-lg shadow-lg">
      {/* Product Image */}
      <img
        src={result.image}
        alt={result.title}
        className="w-24 h-24 object-cover rounded-md"
      />

      {/* Product Details */}
      <div className="ml-4">
        <h3 className="text-lg font-bold">{result.title}</h3>
        <p className="text-gray-600">Distributed by {result.distributor}</p>
        <p>
          <strong>Cost:</strong> ${Number(result.cost).toLocaleString()}
        </p>
        <p>
          <strong>Average Weight:</strong> {result.weight} LBS
        </p>
        <p>
          <strong>Stock:</strong> {result.stock} quantity
        </p>
      </div>
    </div>
  );
};

export default SearchResultsItem;
