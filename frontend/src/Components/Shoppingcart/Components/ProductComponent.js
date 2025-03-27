import "./ProductComponent.css"
import carrot from "./Images/carrot.png"
function ProductComponent({result}){
    return (
        <div className="flex items-center border p-4 bg-white rounded-lg shadow-lg">
          {/* Product Image */}
          <img
            src={result.ImageLink}
            alt={result.ProductName}
            className="w-24 h-24 object-cover rounded-md"
          />
    
          {/* Product Details */}
          <div className="ml-4">
            <h3 className="text-lg font-bold">{result.ProductName}</h3>
            <p className="text-gray-600">Distributed by {result.Distributor}</p>
            <p>
              <strong>Cost:</strong> ${Number(result.Cost).toLocaleString()}
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
      );
}
export default ProductComponent;

