import { useState} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useErrorResponse } from '../Utils/AxiosError';

import { employeeFormat, signUpFormatEmployee } from '../Utils/Formatting';

//UpdateEmployee Component
export function UpdateEmployee({ employee }) {
  
    const { handleError } = useErrorResponse(); 

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 

          UserID: employee.UserID,

          EmployeeID: employee.EmployeeID,

          UserNameFirst: employee.UserNameFirst,

          UserNameLast: employee.UserNameLast,

          UserPhoneNumber: employee.UserPhoneNumber,

          EmployeeHireDate: employee.EmployeeHireDate?.slice(0, 10),

          EmployeeStatus: employee.EmployeeStatus,

          EmployeeBirthDate: employee.EmployeeBirthDate?.slice(0, 10),

          EmployeeDepartment: employee.EmployeeDepartment,

          EmployeeHourly: employee.EmployeeHourly,

          SupervisorID: employee.SupervisorID

      });

    //Handle Change Function
    const handleChange = (e) => {

      const { name, value } = e.target;

      setFormData(prevData => ({

        ...prevData,

        [name]: value

      }));

    };

    //Clicking Submit Function
    const clickSubmit = async (e) => {

      e.preventDefault();
    
    
      if (
        !employeeFormat(
          formData.UserID,
          formData.UserNameFirst,
          formData.UserNameLast,
          formData.UserPhoneNumber
        ) ||
        !signUpFormatEmployee(
          formData.EmployeeHireDate,
          formData.EmployeeStatus,
          formData.EmployeeBirthDate,
          formData.EmployeeDepartment,
          Number(formData.EmployeeHourly),
          formData.SupervisorID
        )
      ) {
    
        return;
    
      }
    
    
      try {
    
        await axios.put(
          'http://localhost:3301/api/employee/employee',
          {
            "UserID": formData.UserID,
    
            "EmployeeID": formData.EmployeeID,
    
            "UserNameFirst": formData.UserNameFirst,
    
            "UserNameLast": formData.UserNameLast,
    
            "UserPhoneNumber": formData.UserPhoneNumber,
    
            "EmployeeHireDate": formData.EmployeeHireDate,
    
            "EmployeeStatus": formData.EmployeeStatus,
    
            "EmployeeBirthDate": formData.EmployeeBirthDate,
    
            "EmployeeDepartment": formData.EmployeeDepartment.trim(),
    
            "EmployeeHourly": Number(formData.EmployeeHourly),
    
            "SupervisorID": formData.SupervisorID,
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

        <form onSubmit={clickSubmit} className="m-auto mb-10 bg-white p-6 rounded-2xl shadow-lg w-96 mt-10">

          <h2 className="text-2xl font-semibold text-center mb-4">Update Employee</h2>

          <label className="block mb-2 text-gray-700">Username</label>

          <input 

            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

            id="User-ID" 

            name="UserID" 

            type="text" 

            value={formData.UserID} 

            readOnly

            required 

            minLength={5}

            maxLength={255}

          />
          
          <label className="block mb-2 text-gray-700">First Name</label>

          <input 

            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

            id="First-Name" 

            name="UserNameFirst" 

            type="text" 

            minLength={2}

            maxLength={255}

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

            minLength={2}
            
            maxLength={255}

          />
          
          <label className="block mb-2 text-gray-700">Phone Number</label>

          <input 

            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

            id="Phone-Number"

            name="UserPhoneNumber" 

            type="text"

            value={formData.UserPhoneNumber} 

            onChange={handleChange}

            placeholder="Enter Phone Number: x-xxx-xxx-xxxx" 

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

            minLength={2}
            
            maxLength={255}

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

            min="0"

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

      </section>

    );

}
