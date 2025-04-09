//Import React Functions
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Custom Hook
import { useAuth } from "../../Context/AuthHook";

//Import Axios
import axios from "axios";

//Robot Addition Component
export function RobotAdd() {
    //Get the Navigate Function
    const navigate = useNavigate();

    //Get the Logout Function
    const { logout } = useAuth();

    // Form states
    const [RobotID, setRobotID] = useState("");
    const [Maintanence, setMaintanence] = useState("");
    const [Speed, setSpeed] = useState(0);
    const [BatteryLife, setBatteryLife] = useState(0);

    //Check The Format
    const format = () =>{
        if(RobotID==""){
            alert("Please Fill In Robot ID")
            return false
        }
        if(Maintanence==""){
            alert("Please Fill In Maintenance Date")
            return false;
        }

        if(Speed==0){
            alert("Please Fill In Speed Above 0")
            return false;
        } 
        
        if(BatteryLife==null){
            alert("Please Fill In Battery Life")
            return false;
        }

        if(RobotID.trim().length < 5){
            alert("Robot ID Must Be At Least 5 Characters Long")
            return false;
        }

        if(Speed < 0 || Speed > 100){
            alert("Speed Must Be Between 0 and 100")
            return false;
        }

        if(BatteryLife < 0 || BatteryLife > 100){
            alert("Battery Life Must Be Between 0 and 100")
            return false;
        }

        if(new Date(Maintanence) < new Date()){
            alert("Maintenance Date Cannot Be In The Past")
            return false;
        }

        if(RobotID.length > 255){
            alert("Robot ID Cannot Be More Than 255 Characters Long")
            return false;
        }

        return true;
    }

    //Submit The Form 
    const handleSubmit = (e) => {
        e.preventDefault();

        //Check If The Form Is Valid
        if(!format()){
            return; 
        }

        //Get The Token From The Local Storage
        const token = localStorage.getItem('accessToken');

        //If The Token Is Not Found Then Alert Them And Logout The User
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        //Query The Backend For The Addition of Robot
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
        //If The Request Is Successfull
        .then((response) => {
            alert("Added");
            navigate("/");
        })
        //If The Request Fails
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
            }
        });
    }

    //The Form 
    return (
        <section>
            <h2 className="text-4xl font-bold text-center mb-8">Add Robot</h2>
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
                        min="0"
                        max="100"
                        required 
                        value={Speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="BatteryLife" className="block text-sm font-medium text-gray-700">Battery Life</label>
                    <input
                        id="BatteryLife"
                        type="number"
                        min="0"
                        max="100"
                        required
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
        </section>
    );
}
