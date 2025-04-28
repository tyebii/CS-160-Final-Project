import { useState, useEffect } from "react";

import { Link, useParams} from "react-router-dom";

import SearchResultsItem from "./SearchResultsItem";

import SearchResultsFilter from "./SearchResultsFilter";

import { useAuth } from '../../Context/AuthHook';

import axios from "axios";

import { useErrorResponse } from '../Utils/AxiosError';

//Search Result Component
function SearchResults() {

  const { handleError } = useErrorResponse(); 
  
  const {auth} = useAuth()

  const {searchType, query} = useParams();

  const [results, setResults] = useState([]);

  //Fetches The Results Of The Queries
  useEffect(() => {
    
    const fetchSearchResults = async () => {

      try {

        let endPoint = "";
  
        if (!auth || auth === "Customer") {

          endPoint = `http://localhost:3301/api/inventory/search/${searchType}/customer/${query}`;
        
        } else {

          endPoint = `http://localhost:3301/api/inventory/search/${searchType}/employee/${query}`;
        
        }
  
        const response = await axios.get(endPoint, {

          withCredentials: true,

          headers: { 'Content-Type': 'application/json' },

        });
  
        setResults(response.data);
  
      } catch (error) {

        handleError(error);

      }

    };
  
    fetchSearchResults();

  }, [searchType, query]);
  
  //Filtering the results based on demmand
  const handleFilterSelect = (filterType) => {

    let sortedResults = [...results]; 

    if (filterType === "Low to High Weight") {

        sortedResults.sort((a, b) => a.Weight - b.Weight);

    } else if (filterType === "High to Low Weight") {

        sortedResults.sort((a, b) => b.Weight - a.Weight);

    } else if (filterType === "Low to High Cost") {

        sortedResults.sort((a, b) => a.Cost - b.Cost);

    } else if (filterType === "High to Low Cost") {

        sortedResults.sort((a, b) => b.Cost - a.Cost);

    }

    setResults(sortedResults);

  };

  return (

    <section className="flex justify-center w-full">

      <nav className="p-4 bg-gray-200 w-[1000px] mx-auto">

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

              <Link

                key={result.ItemID}

                to={`/itemview/${result.ItemID}`}

                state={{ searchType, query }}

              >

                <SearchResultsItem result={result} />

              </Link>
      
            ))

          )}

        </div>

      </nav>

    </section>

  );  

};

export default SearchResults;
