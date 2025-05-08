//Product Component To Display Product
function ProductComponent({ result }) {
  
  return (
    
    <div className="flex items-center border-b p-4 bg-white mx-auto">

      <img src={result.ImageLink} alt={result.ProductName} className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"/>

      <div className="ml-6 flex-1 space-y-2">

        <h3 className="text-xl font-semibold">{result.ProductName}</h3>

        <p className="text-sm text-gray-600">Distributed by {result.Distributor}</p>
        
        <div className="text-md text-gray-700">

          <p>

          {result.Weight} lbs. | ${result.Cost.toFixed(2)}/ea

          </p>

          <p>

            <strong>In Stock:</strong> {result.Quantity}

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
