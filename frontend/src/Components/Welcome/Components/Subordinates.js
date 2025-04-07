import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthHook";

const Subordinates = () => {
  const { logout } = useAuth();
  const [subordinates, setSubordinates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No token found");
      logout();
      return;
    }

    axios
      .get(`http://localhost:3301/api/employee/employee/supervisor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSubordinates(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        } else {
          alert(`Error Status ${error.status}: ${error.response.data.err}`);
        }
      });
  }, []);


  const clickTerminate = (employeeID)=>{

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("No token found");
      logout();
      return;
    }

    axios.delete("http://localhost:3301/api/employee/employee", {
        data: { EmployeeID: employeeID },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Successfully Deleted");
        setSubordinates(subordinates.filter(subordinate => subordinate.EmployeeID !== employeeID));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        } else {
          alert(`Error Status ${error.status}: ${error.response.data.err}`);
        }
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
                Employee {subordinate.EmployeeID}
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">
                {`${subordinate.UserNameFirst} ${subordinate.UserNameLast}`}
            </p>
            <div className="w-full text-sm text-gray-700 space-y-1 mb-6">
                <p><strong>Phone:</strong> {subordinate.UserPhoneNumber}</p>
                <p><strong>ID:</strong> {subordinate.EmployeeID}</p>
                <p><strong>Hire Date:</strong> {subordinate.EmployeeHireDate.slice(0,10)}</p>
                <p><strong>Status:</strong> {subordinate.EmployeeStatus}</p>
                <p><strong>Department:</strong> {subordinate.EmployeeDepartment}</p>
                <p><strong>Hourly Rate:</strong> ${subordinate.EmployeeHourly}</p>
                <p><strong>Supervisor ID:</strong> {subordinate.SupervisorID}</p>
            </div>
            <div>
                <button className="mr-5 mt-auto bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
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

export default Subordinates;
