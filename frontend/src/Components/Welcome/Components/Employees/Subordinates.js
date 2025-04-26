//Import React Functions
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

//Import Axios
import axios from "axios";

//Error Message Hook
import { useErrorResponse } from '../../../Utils/AxiosError';

export default function SubordinatesArea({ auth, logout }) {

  const navigate = useNavigate(); 

  return (

    auth === "Manager" ? (

      <article className="w-[100%] mx-auto px-5 py-5 bg-gray-200 rounded-lg shadow-md mb-20">

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Employees</h2>

        <Subordinates auth = {auth} />
                
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Add Employee</h2>

        <div className="mb-10 flex justify-center items-center h-full">

          <button

            onClick={() => navigate('/addemployee')}

            className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors"

          >

            Add Employee

          </button>

        </div>

      </article>

    ) : null

  );

}

//Import List Of Employees
const Subordinates = ({auth}) => {
  
  const { handleError } = useErrorResponse(); 

  const navigate = useNavigate()

  const [subordinates, setSubordinates] = useState([]);

  //Load The Employees
  useEffect(() => {

    if(auth == null){

      return 
      
    }
    
    axios

      .get(`http://localhost:3301/api/employee/employee/supervisor`, {

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      })

      .then((response) => {

        setSubordinates(response.data);

      })

      .catch((error) => {

        handleError(error)

      });

    }, [auth]);

  //Clicking Delete On An Employee
  const clickTerminate = (employeeID)=>{

    axios.delete("http://localhost:3301/api/employee/employee", {

        data: { EmployeeID: employeeID },

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      })

      .then((response) => {

        setSubordinates(subordinates.filter(subordinate => subordinate.EmployeeID !== employeeID));

      })

      .catch((error) => {

        handleError(error)

      });

  }

  return (

    <div className="p-6 ">

        {subordinates.length === 0 ? (

            <p>No Subordinates</p>

        ) : (

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {subordinates.map((subordinate) => (

                <div

                key={subordinate.UserID}

                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 p-5 flex flex-col items-center"

                >

                <h3 className="text-xl font-semibold text-gray-900 mb-2">

                    Employee {subordinate.UserID}

                </h3>

                <p className="text-sm text-gray-500 mb-4 italic">

                    {`${subordinate.UserNameFirst} ${subordinate.UserNameLast}`}

                </p>

                <div className="w-full text-sm text-gray-700 space-y-1 mb-6">

                    <p><strong>Phone:</strong> {subordinate.UserPhoneNumber}</p>

                    <p><strong>Employee ID:</strong> {subordinate.EmployeeID}</p>

                    <p><strong>Hire Date:</strong> {subordinate.EmployeeHireDate.slice(0,10)}</p>

                    <p><strong>Status:</strong> {subordinate.EmployeeStatus}</p>

                    <p><strong>Department:</strong> {subordinate.EmployeeDepartment}</p>

                    <p><strong>Hourly Rate:</strong> ${subordinate.EmployeeHourly}</p>

                    <p><strong>Supervisor ID:</strong> {subordinate.SupervisorID}</p>

                </div>

                <div>

                    <button onClick = {() => { navigate("/updateemployee", { state: subordinate }) }} className="mr-5 mt-auto bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">

                        Edit

                    </button>

                    <button onClick = {()=>{clickTerminate(subordinate.EmployeeID)}}className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        
                        Terminate

                    </button>

                </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
  
};


