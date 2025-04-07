import { Link } from "react-router-dom";
import FlaggedItem from "./FlaggedItem";
import { useState } from "react";
//Import navigation functionality
import { useNavigate } from "react-router-dom";

export const TaggedItems = ({items}) => {

  console.log("TaggedItems", items)
  const itemList = items

  return (
    <div  className="bg-white p-4 mb-5 border shadow-lg">
        {itemList.map((item) => (
            <FlaggedItem key={item.ItemID} item={item} />
        ))}
    </div>
  );
};


