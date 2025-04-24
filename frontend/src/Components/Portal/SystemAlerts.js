//Import React Functions
import { useEffect, useState } from "react";

//Import axios
import  axios  from "axios";

//Import Custom Components
import { TaggedItems } from "./TaggedItems";

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//System alerts 
const SystemAlerts = () => {

  const { handleError } = useErrorResponse(); 

  const [lowStockTriggers, setLowStockTriggers] = useState([]);

  const [expirationDateTriggers, setExpirationDateTriggers] = useState([]);

  const [robotMalfunctions, setRobotMalfunctions] = useState([]);

  const [featured, setFeatured] = useState([]);

  useEffect(() => {

    axios

      .get(`http://localhost:3301/api/inventory/lowstock`,{

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

    })

      .then((response) => {

        setLowStockTriggers(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

    axios
      .get(`http://localhost:3301/api/robot/robot/faulty`,{

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      })

      .then((response) => {

        setRobotMalfunctions(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

      axios

      .get(`http://localhost:3301/api/inventory/expiration`,{

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      })

      .then((response) => {

        setExpirationDateTriggers(response.data);
        
      })

      .catch((error) => {

        handleError(error);

      });

      axios

      .get(`http://localhost:3301/api/inventory/featured`,{

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

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
