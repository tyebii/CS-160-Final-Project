//React funtions
import { useState, useEffect } from "react";

import { Link, useParams} from "react-router-dom";

//Custom Components
import SearchResultsItem from "./SearchResultsItem";

import SearchResultsFilter from "./SearchResultsFilter";

//Custom Context
import { useAuth } from '../../Context/AuthHook';

//Backend Requests
import axios from "axios";

//Token Validation Hook
import { useValidateToken } from '../Utils/TokenValidation';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//Search Result Component
function SearchResults() {

  const validateToken = useValidateToken();

  const { handleError } = useErrorResponse(); 
  
  const {auth} = useAuth()

  const {searchType, query} = useParams();

  const [results, setResults] = useState([]);

  //Renders based on changes to searchType and Query 
  useEffect(() => {

    let endPoint = "";

    let token;

    if(!auth || auth == "Customer"){

      endPoint = `http://localhost:3301/api/inventory/search/${searchType}/customer/${query}`

    }else{

      token = validateToken();

      if(token == null){

        return

      }

      endPoint = `http://localhost:3301/api/inventory/search/${searchType}/employee/${query}`

    }

    //This function will require an authentication header for employees
    axios.get(endPoint,{

        headers: {

            'Authorization': `Bearer ${token}`

        }

      })

      .then((response) => {

        setResults(response.data);

      })

      .catch((error) => {

        handleError(error)

      });
    
  },[searchType, query]);
  
  //Filtering the results based on demmand
  const handleFilterSelect = (filterType) => {

    let sortedResults = [...results]; 

    if (filterType === "Low to High Weight") {

        sortedResults.sort((a, b) => a.Weight - b.Weight);

    } else if (filterType === "High to Low Weight") {

        sortedResults.sort((a, b) => b.Weight - a.Weight);

    } else if (filterType === "Low to High Cost") {

        sortedResults.sort((a, b) => a.SupplierCost - b.SupplierCost);

    } else if (filterType === "High to Low Cost") {

        sortedResults.sort((a, b) => b.SupplierCost - a.SupplierCost);

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

              <Link key={result.ItemID} to={`/itemview/${result.ItemID}`}>

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
