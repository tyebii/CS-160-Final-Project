import { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";

import SearchResultsItem from "./SearchResultsItem";

import SearchResultsFilter from "./SearchResultsFilter";

import { useAuth } from '../../Context/AuthHook';

import axios from "axios";

import { useErrorResponse } from '../Utils/AxiosError';

//Search Result Component
function SearchResults() {

  const { handleError } = useErrorResponse(); 
  
  const {auth} = useAuth()

  const { searchType, query } = useParams();

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

    <section className="flex flex-col px-4 md:px-8 bg-white">

      <div className="flex flex-row justify-between items-center py-8 sm:mx-8 md:mx-4 lg:mx-2 text-2xl">

        <div className="p-4 w-1/2 max-w-2/3">
          Displaying <strong>{results.length}</strong> results for <strong>{query.replace(/-/g," ")}</strong>
        </div>

        {/* Filter Section */}
        <div className="flex p-4 justify-end">

          <SearchResultsFilter onFilterSelect={handleFilterSelect} />

        </div>

      </div>

      <nav className="p-2">

        {/* Search Result List */}
        <div className="md:mx-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center">

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
