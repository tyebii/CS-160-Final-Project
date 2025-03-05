import { useState, useEffect } from "react";
import SearchResultsItem from "./SearchResultsItem";
import SearchResultsFilter from "./SearchResultsFilter";

const SearchResults = ({/*query*/}) => {
  //TODO: Take in query from search bar 
  const mockResults = [
    {
      id: 1,
      title: "Oliver’s Ranch Style Carrots",
      distributor: "American Foods",
      cost: 500,
      weight: 5,
      stock: 50,
      image: "test",
    },
    {
      id: 2,
      title: "Dante’s Ranch Style Carrots",
      distributor: "American Foods Association",
      cost: 600,
      weight: 6,
      stock: 40,
      image: "test",
    },
  ];

  const [results, setResults] = useState(mockResults);

  const handleFilterSelect = (filterType) => {
    let sortedResults = [...results];

    if (filterType === "weight") {
      sortedResults.sort((a, b) => a.weight - b.weight);
    } else if (filterType === "cost") {
      sortedResults.sort((a, b) => (a.cost.length < b.cost.length ? 1 : -1));
    }
    setResults(sortedResults);
  };

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      {/* Search Results Header */}
    <h2 className="text-4xl font-bold text-center mb-4">Search Results</h2>

    {/* Filter Section */}
    <div className="flex justify-start mb-4">
      <SearchResultsFilter onFilterSelect={handleFilterSelect} />
    </div>

      {/* Search Result List */}
      <div className="grid gap-4">
        {results.map((result) => (
          <SearchResultsItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
