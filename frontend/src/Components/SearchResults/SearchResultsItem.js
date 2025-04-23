//Custom Context
import { useAuth } from '../../Context/AuthHook';

//Search Results Card
const SearchResultsItem = ({ result }) => {

  const { auth } = useAuth();

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

          <strong>Cost:</strong> ${result.Cost}

        </p>

        <p>

          <strong>Average Weight:</strong> {result.Weight} LBS

        </p>
        
        {auth == "Manager" || auth == "Employee" ? (

          <div>

            <p>

              <strong>Last Modification:</strong> {result.LastModification} 

            </p>

            <p>

              <strong>ItemID:</strong> {result.ItemID} 

            </p>

          </div>

        ) : null}
        
      </div>

    </div>

  );
  
};

export default SearchResultsItem;
