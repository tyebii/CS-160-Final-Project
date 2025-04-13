//Import React Functions
import { useEffect, useState } from "react";

//Import axios
import  axios  from "axios";

//Import Custom Components
import { TaggedItems } from "./TaggedItems";

import { useNavigate } from "react-router-dom";

//Import Auth Context
import { useAuth } from "../../Context/AuthHook";

//System alerts 
const SystemAlerts = () => {

  const navigate = useNavigate()

  const { logout } = useAuth();

  const [lowStockTriggers, setLowStockTriggers] = useState([]);

  const [expirationDateTriggers, setExpirationDateTriggers] = useState([]);

  const [robotMalfunctions, setRobotMalfunctions] = useState([]);

  const [featured, setFeatured] = useState([]);

  //TODO: Need expiration date endpoint for triggers
  useEffect(() => {

      //Get The Token From The Local Storage
      const token = localStorage.getItem('accessToken');

      //If There Is No Token Alert The User and Log Them Out
      if (!token) {

        alert('Login Information Not found')

        logout()

        navigate('/login')

        return;
      }

    //call lowstock endpoint
    axios
      .get(`http://localhost:3301/api/inventory/lowstock`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLowStockTriggers(response.data);
      })
      .catch((error) => {
          if (error.response?.status === 401) {

            alert("You need to login again!");

            logout();

            navigate('/login')

          }else{

            alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
          
          }
      });

    //call faulty robot endpoint
    axios
      .get(`http://localhost:3301/api/robot/robot/faulty`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRobotMalfunctions(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {

          alert("You need to login again!");

          logout();

          navigate('/login')

        }else{

          alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
        
        }
      });

      axios
      .get(`http://localhost:3301/api/inventory/expiration`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setExpirationDateTriggers(response.data);
      })
      .catch((error) => {
          if (error.response?.status === 401) {

            alert("You need to login again!");

            logout();

            navigate('/login')

          }else{

            alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
          
          }
      });

      axios
      .get(`http://localhost:3301/api/inventory/featured`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFeatured(response.data);
      })
      .catch((error) => {
          if (error.response?.status === 401) {

            alert("You need to login again!");

            logout();

            navigate('/login')

          }else{

            alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
          
          }
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 border shadow-lg mb-6">
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
    </div>
  );
};

export default SystemAlerts;
