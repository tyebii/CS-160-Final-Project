//Import React Functions
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Import Custom Hook
import { useAuth } from "../../Context/AuthHook";

//Import Axios
import axios from "axios";

//Import Formatter 
import { validateRobot } from "../Utils/Formatting";

//RobotUpdate Component
export function RobotUpdate({ robot }) {
    //Import Navigate Function
    const navigate = useNavigate();
    //Import Logout Function
    const { logout } = useAuth();

    // Form states with initial values from the robot
    const [RobotID, setRobotID] = useState(robot.RobotID || "");
    const [Maintanence, setMaintanence] = useState(robot.Maintanence?.slice(0, 10) || "");  
    const [Speed, setSpeed] = useState(robot.Speed || 0);
    const [BatteryLife, setBatteryLife] = useState(robot.BatteryLife || 0);
    const [RobotStatus, setRobotStatus] = useState(robot.RobotStatus || 0); 


    //May Want To Use Try Catch
    //Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Maintenance Date before submission:", Maintanence);
        console.log(typeof Maintanence)
        //Check If The Form Is Valid
        if(!validateRobot(RobotID, 0, RobotStatus, Maintanence, Number(Speed) , Number(BatteryLife), 0)){
            return; 
        }

        //Get The Token From The Local Storage
        const token = localStorage.getItem('accessToken');

        if (!token) {

            alert('Login Information Not found')
    
            logout()
    
            navigate('/login')
    
            return;
          }


        // PUT request with updated form data
        axios.put('http://localhost:3301/api/robot/robot', {
            RobotID: RobotID,
            CurrentLoad: 0,
            RobotStatus: RobotStatus,
            Maintanence: Maintanence,
            Speed: Number(Speed),
            BatteryLife: Number(BatteryLife),
            EstimatedDelivery: 0
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            alert("Updated Robot");
            navigate("/");
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
                navigate('/login')
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
            }
        });
    }

    //The Form
    return (
        <section>
            <h2 className="text-4xl font-bold text-center mb-8">Update Robot</h2>
            <form onSubmit={handleSubmit} className="mt-20 grid grid-cols-1 gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
                <div>
                    <label htmlFor="RobotID" className="block text-sm font-medium text-gray-700">Robot ID</label>
                    <input
                        id="RobotID"
                        type="text"
                        value={RobotID} 
                        readOnly
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="CurrentLoad" className="block text-sm font-medium text-gray-700">Current Load</label>
                    <input id="CurrentLoad" type="number" value="0" readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                </div>

                <div>
                    <label htmlFor="RobotStatus" className="block text-sm font-medium text-gray-700">Robot Status</label>
                    <select
                        id="RobotStatus"
                        value={RobotStatus}  
                        onChange={(e) => setRobotStatus(e.target.value)}  
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">Select</option>
                        <option value="Broken">Broken</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Charging">Charging</option>
                        <option value="Free">Free</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="Maintanence" className="block text-sm font-medium text-gray-700">Maintenance Date</label>
                    <input
                        id="Maintanence"
                        type="date"
                        value={Maintanence} 
                        required
                        onChange={(e) => setMaintanence(e.target.value)} 
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="Speed" className="block text-sm font-medium text-gray-700">Speed</label>
                    <input
                        id="Speed"
                        type="number"
                        value={Speed}  
                        min="0"
                        max="100"
                        required
                        onChange={(e) => setSpeed(e.target.value)}  // Update state on change
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="BatteryLife" className="block text-sm font-medium text-gray-700">Battery Life</label>
                    <input
                        id="BatteryLife"
                        type="number"
                        value={BatteryLife}
                        min="0"
                        max="100"
                        required
                        onChange={(e) => setBatteryLife(e.target.value)}  
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="EstimatedDelivery" className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                    <input id="EstimatedDelivery" type="text" value="0" readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                </div>

                <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                    Update Robot
                </button>
            </form>
        </section>
    );
}
