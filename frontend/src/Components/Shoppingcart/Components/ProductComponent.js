//Product Component
function ProductComponent({ result }) {
  
  return (
    <div className="flex items-center border p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-5">

      <img

        src={result.ImageLink}

        alt={result.ProductName}

        className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"

      />

      <div className="ml-6 flex-1">

        <h3 className="text-lg font-bold">{result.ProductName}</h3>

        <p className="text-gray-600">Distributed by {result.Distributor}</p>
        
        <div className="mt-2 space-y-1 text-gray-700">

          <p>

            <strong>Cost:</strong> ${result.Cost}

          </p>

          <p>

            <strong>Average Weight:</strong> {result.Weight} LBS

          </p>

          <p>

            <strong>Stock:</strong> {result.Quantity}

          </p>

          <p>

            <strong>Order Quantity:</strong> {result.OrderQuantity}

          </p>

        </div>

      </div>

    </div>

  );

}

export default ProductComponent;
