import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthHook";
import { useNavigate } from "react-router-dom";
const Robots = () => {
  const navigate = useNavigate()
  const { logout } = useAuth();
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No token found');
      logout();
      return;
    }

    axios.get("http://localhost:3301/api/robot/robot", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setRobots(response.data);
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        alert("You need to login again!");
        logout();
      } else {
        alert(`Error Status ${error.status}: ${error.response.data.error}`);
      }
    });
  }, []);

  const clickDelete = (RobotID) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No token found');
      logout();
      return;
    }

    axios.delete("http://localhost:3301/api/robot/robot", {
      data: { RobotID: RobotID },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      alert("Successfully Deleted");
      setRobots(robots.filter(robot => robot.RobotID !== RobotID));
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        alert("You need to login again!");
        logout();
      } else {
        alert(`Error Status ${error.status}: ${error.response.data.error}`);
      }
    });
  }

  return (
    <div className="p-6">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {robots.map((robot) => (
          <div
            key={robot.RobotID}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{robot.RobotID}</h3>
            <p className="text-sm text-gray-500 mb-3 italic">{robot.RobotStatus}</p>
            <div className="w-full text-sm text-gray-600 space-y-1 mb-4">
              <p><strong>Battery:</strong> {robot.BatteryLife}%</p>
              <p><strong>Speed:</strong> {robot.Speed} km/h</p>
              <p><strong>Load:</strong> {robot.CurrentLoad} kg</p>
              <p><strong>ETA:</strong> {robot.EstimatedDelivery?`${robot.EstimatedDelivery} mins`:"N/A"}</p>
              <p>
                <strong>Maintenance:</strong>{" "}
                {robot.Maintanence ? new Date(robot.Maintanence).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
               <button 
                    onClick={() => { navigate("/updaterobot", { state: robot }) }} 
                    className="mr-5 mt-auto bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                    Edit
                </button>

                <button onClick= {()=>{clickDelete(robot.RobotID)}} className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Robots;
