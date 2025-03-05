import { useState } from "react";
import SearchResults from "../components/SearchResults";

function SearchPage() {
  const[query, setQuery] = useState("");
  return (
    //TODO: Add loginNavbar component
    <div className="flex">
      <div className="flex-grow p-4">
        {/*Navbar here */}
        <SearchResults />
      </div>
    </div>
  );
}

export default SearchPage;
