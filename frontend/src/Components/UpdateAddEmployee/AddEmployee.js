//Import React Functions
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../Context/AuthHook'

//Import Axios
import axios from 'axios';

import { signUpFormat, signUpFormatEmployee } from '../Utils/Formatting';

//Import Add Employee
function AddEmployee() {

  //Import Navigate Function
  const navigate = useNavigate()
  
  const {logout} = useAuth()

  //Form State
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
  const clickSubmit = (e) => {
    e.preventDefault()

    //Check If The Form Is Valid
    if(!signUpFormat(formData.UserID, formData.Password, formData.UserNameFirst, formData.UserNameLast, formData.UserPhoneNumber) && !signUpFormatEmployee(formData.EmployeeHireDate, formData.EmployeeStatus,formData.EmployeeBirthDate,formData.EmployeeDepartment,formData.EmployeeHourly, formData.SupervisorID)){
        return; 
    }
    
    //Get The Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If The Token Is Not Found Then Alert Them And Logout The User
    if (!token) {
      alert('No token found');
      logout();
      navigate('/login')
      return;
    }

    //PUT request with updated form data
    console.log(formData.EmployeeStatus)
    axios.post('http://localhost:3301/api/authentication/signup/employee', {
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
      }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    //If The Request Is Successfull
    .then((response) => {
        alert("Employee Added");
        navigate("/");
    })
    //If The Request Fails
    .catch((error) => {
      if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
          navigate('/login')
      } else {
          alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
      }
    });
  }

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
        />
        
        <label className="block mb-2 text-gray-700">Password</label>
        <input 
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
          id="Password" 
          name="Password" 
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
