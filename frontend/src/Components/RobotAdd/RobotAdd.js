import { useState } from "react";
import { useAuth } from "../../Context/AuthHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function RobotAdd() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Form states
    const [RobotID, setRobotID] = useState("");
    const [Maintanence, setMaintanence] = useState("");
    const [Speed, setSpeed] = useState("");
    const [BatteryLife, setBatteryLife] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        axios.post('http://localhost:3301/api/robot/robot', {
            RobotID,
            CurrentLoad: 0,
            RobotStatus: "Free",
            Maintanence,
            Speed,
            BatteryLife,
            EstimatedDelivery: 0
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            alert("Added");
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
                    value={RobotID}
                    onChange={(e) => setRobotID(e.target.value)}
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
                <input id="RobotStatus" type="text" value="Free" readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
            </div>

            <div>
                <label htmlFor="Maintanence" className="block text-sm font-medium text-gray-700">Maintenance Date</label>
                <input
                    id="Maintanence"
                    type="date"
                    value={Maintanence}
                    onChange={(e) => setMaintanence(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="Speed" className="block text-sm font-medium text-gray-700">Speed</label>
                <input
                    id="Speed"
                    type="text"
                    value={Speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="BatteryLife" className="block text-sm font-medium text-gray-700">Battery Life</label>
                <input
                    id="BatteryLife"
                    type="text"
                    value={BatteryLife}
                    onChange={(e) => setBatteryLife(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="EstimatedDelivery" className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                <input id="EstimatedDelivery" type="text" value="0" readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                Add Robot
            </button>
        </form>
    );
}
