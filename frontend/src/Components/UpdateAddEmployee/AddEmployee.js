//Import React Functions
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';

//Import Axios
import axios from 'axios';

//Import Add Employee
function AddEmployee() {

  //Import Navigate Function
  const navigate = useNavigate()
  
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


  //Format The Form Data Before Submission
  const format = () => {
    if(formData.UserID==null){
      alert("Please Fill In User ID")
      return false
    } 

    if(formData.Password==null){
      alert("Please Fill In Password")
      return false
    }
    
    if(formData.UserNameFirst==null){
        alert("Please Fill In First Name")
        return false
    } 
    
    if(formData.UserNameLast==null){
        alert("Please Fill In Last Name")
        return false
    } 
    
    if(formData.UserPhoneNumber==null){
        alert("Please Fill In Phone Number")
        return false
    } 

    if(formData.EmployeeHireDate==null){
        alert("Please Fill In Hire Date")
        return false
    } 
    
    if(formData.EmployeeStatus==null){
        alert("Please Fill In Employee Status")
        return false
    } 
    
    if(formData.EmployeeBirthDate==null){
        alert("Please Fill In Birth Date")
        return false
    } 
    
    if(formData.EmployeeDepartment==null){
        alert("Please Fill In Department")
        return false
    }
    if(formData.EmployeeHourly===0){
        alert("Please Fill In Hourly Wage")
        return false
    } 
    
    if(formData.SupervisorID==null){
        alert("Supervisor ID Must Be Filled In")
        return false
    }

    if(typeof formData.EmployeeHourly !== "number"){
        alert("Hourly Wage Must Be A Number")
        return false
    }

    if(typeof formData.UserID !== "string"){
        alert("User ID Must Be A String")
        return false
    }

    if(typeof formData.Password !== "string"){
        alert("Password Must Be A String")
        return false
    }

    if (typeof formData.UserNameFirst !== "string"){
        alert("First Name Must Be A String")
        return false
    }

    if (typeof formData.UserNameLast !== "string"){
        alert("Last Name Must Be A String")
        return false
    }

    if (typeof formData.UserPhoneNumber !== "string"){
        alert("Phone Number Must Be A String")
        return false
    }

    if (typeof formData.EmployeeHireDate !== "string"){
        alert("Hire Date Must Be A String")
        return false
    }

    if (typeof formData.EmployeeStatus !== "string"){
        alert("Employee Status Must Be A String")
        return false
    }

    if (typeof formData.EmployeeBirthDate !== "string"){
        alert("Birth Date Must Be A String")
        return false
    }

    if (typeof formData.EmployeeDepartment !== "string"){
        alert("Department Must Be A String")
        return false
    }

    if (typeof formData.SupervisorID !== "string"){
        alert("Supervisor ID Must Be A String")
        return false
    }

    const hasSpaces = (input) => /\s/.test(input);

    if(hasSpaces(formData.UserID)){
        alert("User ID Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.Password)){
        alert("Password Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.UserNameFirst)){
        alert("First Name Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.UserNameLast)){
        alert("Last Name Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.UserPhoneNumber)){
        alert("Phone Number Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.EmployeeHireDate)){
        alert("Hire Date Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.EmployeeStatus)){
        alert("Employee Status Must Not Contain Spaces")
        return false
    }

    if(hasSpaces(formData.EmployeeBirthDate)){
        alert("Birth Date Must Not Contain Spaces")
        return false
    }


    if(hasSpaces(formData.SupervisorID)){
        alert("Supervisor ID Must Not Contain Spaces")
        return false
    }
    
    if(formData.UserID.length < 5){
        alert("User ID Must Be At Least 5 Characters Long")
        return false
    }

    if(formData.UserID.length > 255){
        alert("User ID Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    if(formData.UserNameFirst.length < 2){
        alert("First Name Must Be At Least 2 Characters Long")
        return false
    }

    if(formData.UserNameFirst.length > 255){
        alert("First Name Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    if(formData.UserNameLast.length < 2){
        alert("Last Name Must Be At Least 2 Characters Long")
        return false
    }

    if(formData.UserNameLast.length > 255){
        alert("Last Name Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;

    if(!formData.UserPhoneNumber.match(regexNumber)){
        alert("Phone Number Must Be In The Format 1-XXX-XXX-XXXX")
        return false
    }

    function isValidDate(input) {
      const date = new Date(input);
      return !isNaN(date.getTime());
    }

    function isValidDate(input) {
      //Regex Check
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(input)) return false;

      //See if acts as a valid date
      const date = new Date(input);
      const timestamp = date.getTime();
      if (isNaN(timestamp)) return false;
    
      return input === date.toISOString().slice(0, 10);
    }

    if(new Date(formData.EmployeeHireData) > new Date()){
        alert("Hire Date Must Be In The Past or Present")
        return false
    }

    const set = new Set(["Employed", "Absence", "Fired"]);

    if(!set.has(formData.EmployeeStatus)){
        alert("Invalid Employee Status")
        return false
    }

    if (!isValidDate(formData.EmployeeBirthDate)) {
        alert("Birth Date Must Be A Valid Date")
        return false
    }

    if(new Date(formData.EmployeeBirthDate) > new Date()){
        alert("Birth Date Must Be In The Past")
        return false
    }

    if(formData.EmployeeDepartment.trim().length < 2){
        alert("Department Must Be At Least 2 Characters Long")
        return false
    }

    if(formData.EmployeeDepartment.trim().length > 255){
        alert("Department Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    if(formData.EmployeeHourly <= 0){
        alert("Hourly Wage Must Be Greater Than 0")
        return false
    }

    if(formData.SupervisorID.length < 5){  
        alert("Supervisor ID Must Be At Least 5 Characters Long")
        return false
    }

    if(formData.SupervisorID.length > 255){
        alert("Supervisor ID Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if(!formData.Password.match(regexPassword)){
        alert("Password Must Be At Least 8 Characters Long, Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, And One Special Character")
        return false
    }

    return true
  }

  //Submission of the form
  const clickSubmit = (e) => {
    e.preventDefault()

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
