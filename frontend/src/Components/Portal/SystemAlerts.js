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

    const fetchAllDashboardData = async () => {

      try {

        const [lowStockRes, faultyRobotRes, expirationRes, featuredRes] = await Promise.all([
          
          axios.get(`http://localhost:3301/api/inventory/lowstock`, {
            
            withCredentials: true,

            headers: { 'Content-Type': 'application/json' },

          }),

          axios.get(`http://localhost:3301/api/robot/robot/faulty`, {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' },

          }),

          axios.get(`http://localhost:3301/api/inventory/expiration`, {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' },

          }),

          axios.get(`http://localhost:3301/api/inventory/featured`, {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' },

          }),

        ]);
  
        setLowStockTriggers(lowStockRes.data);

        setRobotMalfunctions(faultyRobotRes.data);

        setExpirationDateTriggers(expirationRes.data);

        setFeatured(featuredRes.data);
  
      } catch (error) {

        handleError(error);

      }

    };
  
    fetchAllDashboardData();
    
  }, []);
  

  return (
    <section className="w-[80%] mx-auto bg-white p-6 border shadow-lg mb-10 mt-10">

      {/* Main Title */}
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">System Alerts</h2>

      {/* Low Stock Section */}
      <div className="mb-20">

        <h3 className="text-2xl font-semibold text-center mb-2">

          Low Stock Triggers: {lowStockTriggers.length}

        </h3>

        {lowStockTriggers.length === 0 

          ? (<p className="text-center mb-5">No Low Stock Items</p>) 

          : (<TaggedItems items={lowStockTriggers} />)}

      </div>

      {/* Expiration Date Section */}
      <div className="mb-20">

        <h3 className="text-2xl font-semibold text-center mb-2">

          Expiration Date Triggers: {expirationDateTriggers.length}

        </h3>

        {expirationDateTriggers.length === 0 

          ? (<p className="text-center mb-5">No Expired Items</p>) 

          : (<TaggedItems items={expirationDateTriggers} />)}

      </div>

      {/* Featured Items Section */}
      <div className="mb-20">

        <h3 className="text-2xl font-semibold text-center mb-2">

          Featured Triggers: {featured.length}

        </h3>

        {featured.length === 0 

          ? (<p className="text-center mb-5">No Featured Items</p>) 

          : (<TaggedItems items={featured} />)}

      </div>

      {/* Robot Malfunctions Section */}
      <div className="mb-20">

        <h3 className="text-2xl font-semibold text-center mb-2">

          Robot Malfunctions: {robotMalfunctions.length}

        </h3>

        {robotMalfunctions.length === 0 

          ? (<p className="text-center mb-5">No Faulty Robots</p>) 

          : (<TaggedItems robots={robotMalfunctions} />)}

      </div>

    </section>

  );

};

export default SystemAlerts;
