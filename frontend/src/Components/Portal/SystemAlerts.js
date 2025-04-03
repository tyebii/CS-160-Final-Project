import { useEffect, useState } from "react";
import { axios } from "axios";

const SystemAlerts = () => {
  const [lowStockTriggers, setLowStockTriggers] = useState(0);
  const [expirationDateTriggers, setExpirationDateTriggers] = useState(0);
  const [robotMalfunctions, setRobotMalfunctions] = useState(0);
  //TODO: Need expiration date endpoint for triggers
  useEffect(() => {
    //call lowstock endpoint
    axios
      .get(`http://localhost:3301/api/lowstock`)
      .then((response) => {
        setLowStockTriggers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching /lowstock endpoint: ", err);
      });
    //call faulty robot endpoint
    axios
      .get(`http://localhost:3301/api/robot/faulty`)
      .then((response) => {
        setRobotMalfunctions(response.data.count);
      })
      .catch((err) => {
        console.error("Error fetching /robot/faulty endpoint: ", err);
      });
  }, [lowStockTriggers, expirationDateTriggers, robotMalfunctions]);
  return (
    <div className="bg-white p-4 border shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-3">System Alerts</h2>
      <div className="border p-4">
        <p>
          <strong>Low Stock Triggers:</strong> {lowStockTriggers}
        </p>
        <p>
          <strong>Expiration Date Triggers:</strong> {expirationDateTriggers}
        </p>
        <p>
          <strong>Robot Malfunctions:</strong> {robotMalfunctions}
        </p>
      </div>
    </div>
  );
};

export default SystemAlerts;
