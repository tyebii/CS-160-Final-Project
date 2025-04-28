import { useState } from "react";
import SearchResults from "../Components/SearchResults/SearchResults.js";


function SearchPage() {

  return (

    <div className="flex">

      <div className="flex-grow p-4">

        <SearchResults />

      </div>

    </div>

  );
  
}

export default SearchPage;