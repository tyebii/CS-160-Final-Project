import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Context/AuthHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function UpdateEmployee({ employee }) {
    const navigate = useNavigate();
    const { logout } = useAuth();



      const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }, []);


      console.log(employee)

      const [formData, setFormData] = useState({    
            UserID: employee.UserID || null,
            EmployeeID: employee.EmployeeID,
            UserNameFirst: employee.UserNameFirst || "",
            UserNameLast: employee.UserNameLast || "",
            UserPhoneNumber: employee.UserPhoneNumber || "",
            EmployeeHireDate: employee.EmployeeHireDate?.slice(0, 10)  || "",
            EmployeeStatus: employee.EmployeeStatus || "",
            EmployeeBirthDate: employee.EmployeeBirthDate?.slice(0, 10)  || "",
            EmployeeDepartment: employee.EmployeeDepartment || "",
            EmployeeHourly: employee.EmployeeHourly || 0,
            SupervisorID: employee.SupervisorID || ""
        });



      
      const clickSubmit = (e) => {
        e.preventDefault()
    
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }
    

        axios.put('http://localhost:3301/api/employee/employee', {
            "UserID": formData.UserID,
            "EmployeeID": formData.EmployeeID,
            "UserNameFirst": formData.UserNameFirst,
            "UserNameLast": formData.UserNameLast,
            "UserPhoneNumber": formData.UserPhoneNumber,
            "EmployeeHireDate": formData.EmployeeHireDate,
            "EmployeeStatus": formData.EmployeeStatus,
            "EmployeeBirthDate": formData.EmployeeBirthDate,
            "EmployeeDepartment": formData.EmployeeDepartment,
            "EmployeeHourly": Number(formData.EmployeeHourly),
            "SupervisorID": formData.SupervisorID
          }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            alert("Employee Updated");
            navigate("/");
        })
        .catch((error) => {
            console.log(error);  // Log the full error for debugging
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
            }
        });
    }
    
      return (
        <form onSubmit={clickSubmit} className="m-auto mb-10 bg-white p-6 rounded-2xl shadow-lg w-96 mt-10">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up Employee</h2>
          
          <label className="block mb-2 text-gray-700">Username</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="User-ID" 
            name="UserID" 
            type="text" 
            value={formData.UserID} 
            readOnly
            required 
          />
          
          <label className="block mb-2 text-gray-700">First Name</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="First-Name" 
            name="UserNameFirst" 
            type="text" 
            value={formData.UserNameFirst} 
            onChange={handleChange} 
            placeholder="Enter First Name" 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Last Name</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Last-Name" 
            name="UserNameLast" 
            type="text" 
            value={formData.UserNameLast} 
            onChange={handleChange} 
            placeholder="Enter Last Name" 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Phone Number</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Phone-Number" 
            name="UserPhoneNumber" 
            type="text" 
            value={formData.UserPhoneNumber} 
            onChange={handleChange} 
            placeholder="Enter Phone Number" 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Hire Date</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Employee-HireDate" 
            name="EmployeeHireDate" 
            type="date" 
            value={formData.EmployeeHireDate} 
            onChange={handleChange} 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Employee Status</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Employee-Status" 
            name="EmployeeStatus" 
            value={formData.EmployeeStatus} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Status</option>
            <option value="Employed">Employed</option>
            <option value="Absence">Absence</option>
            <option value="Fired">Fired</option>
          </select>
          
          <label className="block mb-2 text-gray-700">Birth Date</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Employee-BirthDate" 
            name="EmployeeBirthDate" 
            type="date" 
            value={formData.EmployeeBirthDate} 
            onChange={handleChange} 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Department</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Employee-Department" 
            name="EmployeeDepartment" 
            type="text" 
            value={formData.EmployeeDepartment} 
            onChange={handleChange} 
            placeholder="Enter Department" 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Hourly Wage</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Employee-Hourly" 
            name="EmployeeHourly" 
            type="number" 
            value={formData.EmployeeHourly} 
            onChange={handleChange} 
            placeholder="Enter Hourly Wage" 
            required 
          />
          
          <label className="block mb-2 text-gray-700">Supervisor ID</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
            id="Supervisor-ID" 
            name="SupervisorID" 
            type="text" 
            value={formData.SupervisorID} 
            onChange={handleChange} 
            placeholder="Enter Supervisor ID" 
            required 
          />
          
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Update</button>
        </form>
      );
    }
