//Import React Functions
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

//Import Axios
import axios from "axios";

//Error Message Hook
import { useErrorResponse } from '../../../Utils/AxiosError';

//Robot Area 
export default function RobotArea({trigger, setTrigger,  auth, logout}) {

  const navigate = useNavigate()

  return (

    (auth === "Employee" || auth === "Manager") ? (

      <article className="w-[100%] mx-auto px-5 py-5 bg-gray-200 rounded-lg shadow-md mb-20">

        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Robot Fleet</h2>

        <Robots trigger = {trigger} setTrigger = {setTrigger} logout={logout} auth ={auth} />

        {/* Only show the button if the user is a Manager */}
        {auth === "Manager" && (

          <>

            <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Add Robot</h2>

            <div className="mb-10 flex justify-center items-center h-full">

              <button

                onClick={() => navigate('/addrobot')}

                className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors"

              >

                Add Robot

              </button>

            </div>

          </>

        )}

      </article>

    ) : null

  );
  
}

//Robot Component
function Robots ({trigger, setTrigger, logout, auth}){

  const navigate = useNavigate()
  
  const { handleError } = useErrorResponse(); 

  const [robots, setRobots] = useState([]);

  //Load The Robots
  useEffect(() => {

    axios.get("http://localhost:3301/api/robot/robot", {

      withCredentials: true,

      headers: { 'Content-Type': 'application/json' }

    })

    .then((response) => {

      setRobots(response.data);

    })

    .catch((error) => {

      handleError(error)

    });

  }, [trigger]);

  //Schedule Robots
  const scheduleClick = () => {

    axios.put(

      "http://localhost:3301/api/delivery/schedule",

      {}, 

      {

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      }

    )
    

    .then((response) => {

      setTrigger(prev => prev + 1);

    })

    .catch((error) => {

      handleError(error)

    });

  }

  //Deploy Robots
  const deployRobots = () => {

  axios.put(

    "http://localhost:3301/api/delivery/deploy",

    {}, 

    {

      withCredentials: true,

      headers: { 'Content-Type': 'application/json' }

    }

  )
  
  .then((response) => {

    setTrigger(prev => prev + 1);

  })

  .catch((error) => {

    handleError(error)

  });

  }

  //Function To Handle The Click Of The Delete Button
  const clickDelete = (RobotID) => {

    axios.delete("http://localhost:3301/api/robot/robot", {

      data: { RobotID: RobotID },

      withCredentials: true,

      headers: { 'Content-Type': 'application/json' }

    })

    .then((response) => {

      setRobots(robots.filter(robot => robot.RobotID !== RobotID));

    })

    .catch((error) => {

      handleError(error)

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

            {/* Robot ID and Status */}
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{robot.RobotID}</h3>

            <p className="text-sm text-gray-500 mb-3 italic">{robot.RobotStatus}</p>

            {/* Robot Details */}
            <div className="w-full text-sm text-gray-600 space-y-1 mb-4">

              <p><strong>Load:</strong> {robot.CurrentLoad} LBS</p>

              <p><strong>ETA:</strong> {robot.EstimatedDelivery ? `${new Date(robot.EstimatedDelivery).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} mins` : "N/A"}</p>

              <p>

                <strong>Maintenance:</strong> 

                {robot.Maintanence ? new Date(robot.Maintanence).toLocaleDateString() : "N/A"}

              </p>

            </div>

            {/* Action Buttons */}
            {auth==="Manager"? (       

              <div className="mt-auto flex gap-4">

                <button 

                  onClick={() => {

                      if (robot.RobotStatus === "En Route") {

                          alert("Robot is in progress");

                          return;

                      }else{

                        navigate("/updaterobot", { state: robot })

                      }

                  }}

                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors w-full sm:w-auto">

                  Edit

                </button>


                <button 

                  onClick={() => {

                      if (robot.RobotStatus === "En Route") {

                          alert("Robot is in progress");

                          return;

                      }else{

                        clickDelete(robot.RobotID)

                      }

                  }}

                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto">

                  Delete

                </button>

              </div>

            ):null}

          </div>

        ))}

      </div>

      {auth === "Manager" ? (

          <div className="mt-8 flex justify-center gap-4">

            <button

              onClick={() => scheduleClick()}

              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"

            >

              Schedule Robots

            </button>

            <button

              onClick={() => deployRobots()}

              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"

            >

              Deploy Robots

            </button>

          </div>

      ) : null}

    </div>

  );
  
};


