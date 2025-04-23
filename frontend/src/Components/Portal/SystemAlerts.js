//Import React Functions
import { useEffect, useState } from "react";

//Import axios
import  axios  from "axios";

//Import Custom Components
import { TaggedItems } from "./TaggedItems";

//Token Validation Hook
import { useValidateToken } from '../Utils/TokenValidation';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//System alerts 
const SystemAlerts = () => {

  const validateToken = useValidateToken();

  const { handleError } = useErrorResponse(); 

  const [lowStockTriggers, setLowStockTriggers] = useState([]);

  const [expirationDateTriggers, setExpirationDateTriggers] = useState([]);

  const [robotMalfunctions, setRobotMalfunctions] = useState([]);

  const [featured, setFeatured] = useState([]);

  useEffect(() => {

      const token = validateToken()

      if(token == null){

        return
        
      }

    axios

      .get(`http://localhost:3301/api/inventory/lowstock`,{

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((response) => {

        setLowStockTriggers(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

    axios
      .get(`http://localhost:3301/api/robot/robot/faulty`,{

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((response) => {

        setRobotMalfunctions(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

      axios

      .get(`http://localhost:3301/api/inventory/expiration`,{

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((response) => {

        setExpirationDateTriggers(response.data);
        
      })

      .catch((error) => {

        handleError(error);

      });

      axios

      .get(`http://localhost:3301/api/inventory/featured`,{

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((response) => {

        setFeatured(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

  }, []);

  return (
    <section className="max-w-4xl mx-auto bg-white p-4 border shadow-lg mb-6">

      <h2 className="text-2xl font-bold mb-3">System Alerts</h2>

        <p>

          <strong>

            Low Stock Triggers: {lowStockTriggers.length}

          </strong>

          { lowStockTriggers.length == 0 ? (<p className="mb-5">No Low Stock Items</p>) : (<TaggedItems items={lowStockTriggers} />)}

        </p>

        <p>

          <strong>Expiration Date Triggers: {expirationDateTriggers.length}</strong>

          { expirationDateTriggers.length == 0 ? (<p className="mb-5">No Expired Items</p>) : (<TaggedItems  items={expirationDateTriggers} />)}

        </p>

        <p>

          <strong>Featured Triggers: {featured.length}</strong>

          { featured.length == 0 ? (<p className="mb-5">No Featured Items</p>) : (<TaggedItems  items={featured} />)}

        </p>

        <p>

          <strong>Robot Malfunctions:  {robotMalfunctions.length}</strong>

          { robotMalfunctions.length == 0 ? (<p className="mb-5">No Faulty Robots</p>) : (<TaggedItems  robots={robotMalfunctions} />)}

        </p>

    </section>
  );
};

export default SystemAlerts;
