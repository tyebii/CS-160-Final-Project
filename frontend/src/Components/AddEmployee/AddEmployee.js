const function AddEmployee(){
    //UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID
    return (
        <form onSubmit={clickSubmit} className="m-auto bg-white p-6 rounded-2xl shadow-lg w-96 mt-10">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
            
            <label className="block mb-2 text-gray-700">Username</label>
            <input className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" id="User-ID" name="UserID" type="text" placeholder="Enter Username" required />
            
            <label className="block mb-2 text-gray-700">Password</label>
            <input className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" id="Password" name="Password" type="password" placeholder="Enter Password" required />
            
            <label className="block mb-2 text-gray-700">First Name</label>
            <input className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" id="First-Name" name="UserNameFirst" type="text" placeholder="Enter First Name" required />
            
            <label className="block mb-2 text-gray-700">Last Name</label>
            <input className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" id="Last-Name" name="UserNameLast" type="text" placeholder="Enter Last Name" required />
            
            <label className="block mb-2 text-gray-700">Phone Number</label>
            <input className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" id="Phone-Number" name="UserPhoneNumber" type="text" placeholder="Enter Phone Number" required />
            
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Sign Up</button>
        </form>
    )
}