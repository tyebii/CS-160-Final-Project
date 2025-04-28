//Custom Component
import FlaggedItem from "./FlaggedItem";

//Item/Robot List
export const TaggedItems = ({items, robots}) => {

  if(items!=null){

    return (

      <div className="bg-gray-200 p-4 mb-5 border shadow-lg max-h-[400px] overflow-y-scroll">

          {items.map((item) => (

              <FlaggedItem key={item.ItemID} item={item} />

          ))}

      </div>

    );

  }else{

    return (

      <div className="bg-gray-200 p-4 mb-5 border shadow-lg max-h-[400px] overflow-y-scroll">

          {robots.map((robot) => (

              <FlaggedItem key={robot.RobotID} robots={robot} />

          ))}

      </div>

    );
    
  }

};