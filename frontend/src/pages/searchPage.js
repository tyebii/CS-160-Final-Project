import { useState } from "react";
import SearchResults from "../components/searchResult/SearchResults";
import ContactInfo from "../components/contactInfo/ContactInfo";

function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    //TODO: Add loginNavbar component
    <div className="flex">
      <div className="flex-grow p-4">
        {/*Navbar here */}
        <SearchResults />
        <ContactInfo />
      </div>
    </div>
  );
}

export default SearchPage;
