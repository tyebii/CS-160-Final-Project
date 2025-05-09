import { useAuth } from '../../Context/AuthHook';

//Search Results Card
const SearchResultsItem = ({ result }) => {

  const { auth } = useAuth();

  return (

    <div className="flex flex-col [width:280px] h-full items-center border p-4 bg-white rounded-lg shadow-md">

      {/* Product Image */}
      <img

        src={result.ImageLink}

        alt={result.ProductName}

        className="border border-gray-400 w-36 h-36 object-cover rounded-md"

      />

      {/* Product Details */}
      <div className="text-center">

        <h3 className="text-xl font-semibold text-emerald-900">{result.ProductName}</h3>

        <p className="text-gray-600">{result.Distributor}</p>

        <p className="text-3xl font-semibold">

          ${result.Cost.toFixed(2)}<span className="text-lg font-normal">/ea</span>

        </p>

        <p className="text-gray-600 text-xs">{result.Weight} lbs</p>

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
