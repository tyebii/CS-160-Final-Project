//React funtions
import { useState, useEffect } from "react";
import SearchResultsItem from "./SearchResultsItem";
import SearchResultsFilter from "./SearchResultsFilter";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthHook";

//Backend Requests
import axios from "axios";

//Search Result Component
function SearchResults() {
  //Auth hook
  const { auth } = useAuth();

  //Parameters passed in the URL
  const { searchType, query } = useParams();

  //Array holding search results
  const [results, setResults] = useState([]);

  //Renders based on changes to searchType and Query
  useEffect(() => {
    let endPoint = ``;
    console.log("This is auth", auth);
    if (auth == null || auth == "Customer") {
      endPoint = `http://localhost:3301/api/search/${searchType}/customer/${query}`;
    } else {
      endPoint = `http://localhost:3301/api/search/${searchType}/employee/${query}`;
    }
    axios
      .get(endPoint)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [searchType, query]);

  //Filtering the results based on demmand
  const handleFilterSelect = (filterType) => {
    let sortedResults = [...results]; // Make a copy of the results array to avoid mutating the original data

    if (filterType === "Low to High Weight") {
      sortedResults.sort((a, b) => a.Weight - b.Weight);
    } else if (filterType === "High to Low Weight") {
      sortedResults.sort((a, b) => b.Weight - a.Weight);
    } else if (filterType === "Low to High Cost") {
      sortedResults.sort((a, b) => a.SupplierCost - b.SupplierCost);
    } else if (filterType === "High to Low Cost") {
      sortedResults.sort((a, b) => b.SupplierCost - a.SupplierCost);
    } else if (filterType === "Low to High Stock") {
      sortedResults.sort((a, b) => a.Quantity - b.Quantity);
    } else if (filterType === "High to Low Stock") {
      sortedResults.sort((a, b) => b.Quantity - a.Quantity);
    } else if (filterType === "Expiration") {
      sortedResults.sort(
        (a, b) => new Date(a.Expiration) - new Date(b.Expiration)
      );
    } else if (filterType === "Name") {
      sortedResults.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
    }
    setResults(sortedResults);
  };

  return (
    <nav className="p-4 bg-gray-200 w-[1000px]">
      {/* Search Results Header */}
      <h2 className="text-4xl font-bold text-center mb-4">Search Results</h2>

      {/* Filter Section */}
      <div className="flex justify-start mb-4">
        <SearchResultsFilter onFilterSelect={handleFilterSelect} />
      </div>

      {/* Search Result List */}
      <div className="grid gap-4">
        {results.length === 0 ? (
          <h3 className="text-2xl font-bold text-center">No results found</h3>
        ) : (
          results.map((result) => (
            <Link key={result.ItemID} to={`/itemview/${result.ItemID}`}>
              <SearchResultsItem result={result} />
            </Link>
          ))
        )}
      </div>
    </nav>
  );
}

export default SearchResults;
