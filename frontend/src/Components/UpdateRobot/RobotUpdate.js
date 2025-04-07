import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function RobotUpdate({ robot }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Form states with initial values from the robot prop
    const [RobotID, setRobotID] = useState(robot.RobotID || "");
    const [Maintanence, setMaintanence] = useState(robot.Maintanence.slice(0, 10) || "");  // Ensures date format is correct
    const [Speed, setSpeed] = useState(robot.Speed || "");
    const [BatteryLife, setBatteryLife] = useState(robot.BatteryLife || "");
    const [RobotStatus, setRobotStatus] = useState(robot.RobotStatus || "Free");  // Assuming a default value

    // Sync with robot prop if it's updated
    useEffect(() => {
        setRobotID(robot.RobotID);
        setMaintanence(robot.Maintanence.slice(0, 10));  // Adjusting format
        setSpeed(robot.Speed);
        setBatteryLife(robot.BatteryLife);
        setRobotStatus(robot.RobotStatus || "Free");
    }, [robot]);  // Re-run when robot prop changes

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        // PUT request with updated form data
        axios.put('http://localhost:3301/api/robot/robot', {
            RobotID,
            CurrentLoad: 0, 
            RobotStatus,  // Using the state value for RobotStatus
            Maintanence,
            Speed,
            BatteryLife,
            EstimatedDelivery: 0, 
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            alert("Updated");
            navigate("/");
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="mt-20 grid grid-cols-1 gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
            <div>
                <label htmlFor="RobotID" className="block text-sm font-medium text-gray-700">Robot ID</label>
                <input
                    id="RobotID"
                    type="text"
                    value={RobotID}  // Binding to state
                    readOnly
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="CurrentLoad" className="block text-sm font-medium text-gray-700">Current Load</label>
                <input id="CurrentLoad" type="text" value="0" readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
            </div>

            <div>
                <label htmlFor="RobotStatus" className="block text-sm font-medium text-gray-700">Robot Status</label>
                <select
                    id="RobotStatus"
                    value={RobotStatus}  // Binding to state
                    onChange={(e) => setRobotStatus(e.target.value)}  // Update state on change
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
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
                    value={Maintanence}  // Binding to state
                    onChange={(e) => setMaintanence(e.target.value)}  // Update state on change
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="Speed" className="block text-sm font-medium text-gray-700">Speed</label>
                <input
                    id="Speed"
                    type="text"
                    value={Speed}  // Binding to state
                    onChange={(e) => setSpeed(e.target.value)}  // Update state on change
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="BatteryLife" className="block text-sm font-medium text-gray-700">Battery Life</label>
                <input
                    id="BatteryLife"
                    type="text"
                    value={BatteryLife}  // Binding to state
                    onChange={(e) => setBatteryLife(e.target.value)}  // Update state on change
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
    );
}
