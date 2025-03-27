import { useState, useEffect } from "react";
import SearchResultsItem from "./SearchResultsItem";
import SearchResultsFilter from "./SearchResultsFilter";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const SearchResults = (/*query*/) => {
  const {searchType, query} = useParams();
  let mockResults = [];
  const [results, setResults] = useState(mockResults);

  useEffect(() => {
    console.log(searchType, query);
    axios.get(`http://localhost:3301/api/search/${searchType}/${query}`)
      .then((response) => {
        console.log(response.data);  
        mockResults = response.data;
        console.log(mockResults);
        setResults(mockResults);
      })
      .catch((error) => {
        console.error("Error:", error);  
      });
    
  },[searchType, query]);

  

  

  
  const handleFilterSelect = (filterType) => {
    let sortedResults = [...results];  // Make a copy of the results array to avoid mutating the original data

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
  } else 

    setResults(sortedResults);
};
  return (
    <div className="p-4 bg-gray-200 w-[1000px]">
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
            <Link to = {`/itemview/${result.ItemID}`}>
              <SearchResultsItem result={result} />
            </Link>

            
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
