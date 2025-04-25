import { useState } from "react";
import SearchResults from "../Components/SearchResults/SearchResults.js";



function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    //TODO: Add loginNavbar component
    <div className="flex">
      <div className="flex-grow p-4">
        <SearchResults />
      </div>
    </div>
  );
}

export default SearchPage;