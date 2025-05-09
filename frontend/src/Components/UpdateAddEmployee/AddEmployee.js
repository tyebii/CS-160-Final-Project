import React, { useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { useErrorResponse } from '../Utils/AxiosError';

import axios from 'axios';

import { signUpFormat, signUpFormatEmployee } from '../Utils/Formatting';

//Import Add Employee
function AddEmployee() {

  const { handleError } = useErrorResponse(); 

  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({

    UserID: '',

    Password: '',

    UserNameFirst: '',

    UserNameLast: '',

    UserPhoneNumber: '',

    EmployeeHireDate: '',

    EmployeeStatus: '',

    EmployeeBirthDate: '',

    EmployeeDepartment: '',

    EmployeeHourly: 0,

    SupervisorID: ''

  });

  // Handles component changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prevData => ({

      ...prevData,

      [name]: name === "EmployeeHourly" ? Number(value) : value

    }));

  };

  //Submission of the form
  const clickSubmit = async (e) => {

    e.preventDefault();
  
  
    if (
      !signUpFormat(
        formData.UserID,
        formData.Password,
        formData.UserNameFirst,
        formData.UserNameLast,
        formData.UserPhoneNumber
      ) ||
      !signUpFormatEmployee(
        formData.EmployeeHireDate,
        formData.EmployeeStatus,
        formData.EmployeeBirthDate,
        formData.EmployeeDepartment,
        formData.EmployeeHourly,
        formData.SupervisorID
      )
    ) {
  
      return;
  
    }
  
  
    try {
  
      await axios.post(
        'http://localhost:3301/api/authentication/signup/employee',
        {
          "UserID": formData.UserID,
  
          "Password": formData.Password,
  
          "UserNameFirst": formData.UserNameFirst,
  
          "UserNameLast": formData.UserNameLast,
  
          "UserPhoneNumber": formData.UserPhoneNumber,
  
          "EmployeeHireDate": formData.EmployeeHireDate,
  
          "EmployeeStatus": formData.EmployeeStatus,
  
          "EmployeeBirthDate": formData.EmployeeBirthDate,
  
          "EmployeeDepartment": formData.EmployeeDepartment.trim(),
  
          "EmployeeHourly": Number(formData.EmployeeHourly),
  
          "SupervisorID": formData.SupervisorID
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
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

        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up Employee</h2>

        <label className="block mb-2 text-gray-700">Username</label>

        <input 

          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

          id="User-ID" 

          name="UserID"

          type="text" 

          value={formData.UserID} 

          onChange={handleChange} 

          placeholder="Enter Username" 

          required 

          minLength={5}

          maxLength={255}
          
        />
        
        <label className="block mb-2 text-gray-700">Password</label>

        <input 

          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

          id="Password" 

          name="Password" 

          minLength={7}

          maxLength={255}

          type="password" 

          value={formData.Password} 

          onChange={handleChange} 

          placeholder="Enter Password" 

          required 

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

          maxLength={255}

          minLength={2}

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

          minLength={2}

          maxLength={255}

          placeholder="Enter Department" 

          required 

        />
        
        <label className="block mb-2 text-gray-700">Hourly Wage</label>

        <input 

          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 

          id="Employee-Hourly" 

          name="EmployeeHourly" 

          type="number" 

          step = "any"

          min = "0"

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
        
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Sign Up</button>

      </form>

    </section>

  );

}

export default AddEmployee;
