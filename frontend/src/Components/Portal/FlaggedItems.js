import FlaggedItem from "./FlaggedItem";
import { useState } from "react";

const FlaggedItems = () => {
  const example = [
    {
      id: 1,
      title: "Oliver’s Ranch Style Carrots",
      distributor: "American Foods",
      cost: "$$$",
      weight: "XX",
      stock: "X",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      title: "Oliver’s Ranch Style Carrots",
      distributor: "American Foods",
      cost: "$$$",
      weight: "XX",
      stock: "X",
      image: "https://via.placeholder.com/100",
    },
  ];
  const [flaggedItems, setFlaggedItems] = useState([]);

  return (
    <div className="bg-white p-4 border shadow-lg">
      <h2 className="text-2xl font-bold mb-3">Flagged Items</h2>
      <div className="space-y-4">
        {example.map((item) => (
          <FlaggedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FlaggedItems;
