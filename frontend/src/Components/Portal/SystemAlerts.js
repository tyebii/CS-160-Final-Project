import { useEffect, useState } from "react";
import  axios  from "axios";
import { TaggedItems } from "./TaggedItems";
import { useAuth } from "../../Context/AuthHook";
const SystemAlerts = () => {

  const { logout } = useAuth();
  const [lowStockTriggers, setLowStockTriggers] = useState([]);
  const [expirationDateTriggers, setExpirationDateTriggers] = useState([]);
  const [robotMalfunctions, setRobotMalfunctions] = useState([]);
  //TODO: Need expiration date endpoint for triggers
  useEffect(() => {

      //Get The Token From The Local Storage
      const token = localStorage.getItem('accessToken');

      //If There Is No Token Alert The User and Log Them Out
      if (!token) {
        alert('No token found');
        logout()
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
          //If Unauthorized Response
          if (error.response?.status === 401) {
            alert("You need to login again!");
            logout();
          }else{
            alert(`Error Status ${error.status}: ${error.response.data.error}`);
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
          //If Unauthorized Response
          if (error.response?.status === 401) {
            alert("You need to login again!");
            logout();
          }else{
            alert(`Error Status ${error.status}: ${error.response.data.error}`);
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
          { lowStockTriggers.length == 0 ? (<p className="mb-5">No Low Stock Inventory</p>) : (<TaggedItems items={lowStockTriggers} />)}
        </p>
        <p>
          <strong>Expiration Date Triggers: {expirationDateTriggers.length}</strong>
          { expirationDateTriggers.length == 0 ? (<p className="mb-5">No Expiration</p>) : (<TaggedItems  items={expirationDateTriggers} />)}
        </p>
        <p>
          <strong>Robot Malfunctions:  {robotMalfunctions.length}</strong>
          { robotMalfunctions.length == 0 ? (<p className="mb-5">No Faulty Robots</p>) : (<TaggedItems  robots={robotMalfunctions} />)}
        </p>
    </div>
  );
};

export default SystemAlerts;
