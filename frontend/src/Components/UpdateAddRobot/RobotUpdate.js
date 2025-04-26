//Import React Functions
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

//Import Axios
import axios from "axios";

//Import Formatter 
import { validateRobot } from "../Utils/Formatting";

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//RobotUpdate Component
export function RobotUpdate({ robot }) {

    const navigate = useNavigate();

    const { handleError } = useErrorResponse(); 

    const [RobotID, setRobotID] = useState(robot.RobotID || "");

    const [Maintanence, setMaintanence] = useState(robot.Maintanence?.slice(0, 10) || "");  

    const [RobotStatus, setRobotStatus] = useState(robot.RobotStatus || 0); 

    //Handle Form Submission
    const handleSubmit = async (e) => {

        e.preventDefault();
      
        if (!validateRobot(RobotID, 0, RobotStatus, Maintanence)) {
      
          return;
      
        }
      
        try {
      
          await axios.put(
            'http://localhost:3301/api/robot/robot',
            {
              RobotID: RobotID,
      
              CurrentLoad: 0,
      
              RobotStatus: RobotStatus,
      
              Maintanence: Maintanence,
            },

            {

              withCredentials: true,

              headers: { 'Content-Type': 'application/json' },

            }

          );
      
          navigate("/");
      
        } catch (error) {
      
          handleError(error);
      
        }
      
    };
      

    return (

        <section>

            <h2 className="text-4xl font-bold text-center mb-8">Update Robot</h2>

            <form onSubmit={handleSubmit} className="mt-20 grid grid-cols-1 gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">

                <div>

                    <label htmlFor="RobotID" className="block text-sm font-medium text-gray-700">Robot ID</label>

                    <input

                        id="RobotID"

                        type="text"

                        minLength={5}

                        maxLength={255}

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

                    <label htmlFor="Maintanence" className="block text-sm font-medium text-gray-700">Next Maintenance Date</label>

                    <input

                        id="Maintanence"

                        type="date"

                        value={Maintanence} 

                        required

                        onChange={(e) => setMaintanence(e.target.value)} 

                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"

                    />

                </div>

                <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">

                    Update Robot

                </button>

            </form>

        </section>

    );

}
