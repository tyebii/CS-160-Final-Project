//Custom Component
import FlaggedItem from "./FlaggedItem";

//Item/Robot List
export const TaggedItems = ({items, robots}) => {

  if(items!=null){

    return (

      <div  className="bg-white p-4 mb-5 border shadow-lg">

          {items.map((item) => (

              <FlaggedItem key={item.ItemID} item={item} />

          ))}

      </div>

    );

  }else{

    return (

      <div  className="bg-white p-4 mb-5 border shadow-lg">

          {robots.map((robot) => (

              <FlaggedItem key={robot.RobotID} robots={robot} />

          ))}

      </div>

    );
    
  }

};


