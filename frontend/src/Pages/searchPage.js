import { useState } from "react";
import SearchResults from "../Components/SearchResults/SearchResults.js";


function SearchPage() {

  return (

    <div className="flex">
      <div className="flex-grow">
        <SearchResults />

      </div>

    </div>

  );
  
}

export default SearchPage;