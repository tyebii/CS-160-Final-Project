//Refactored By: [Matthew Delurio, 4/8/2025]
//Goals:
// 1. Refactor the code to make it more readable and maintainable.


//Import Custom Components
import Categories from './Components/Categories/Category' //The Categories
import Carousel from './Components/Carousel/Carousel';
import RobotArea from './Components/Robot/Robots';
import TransactionArea from './Components/Transactions/TransactionsTable'; 
import SubordinatesArea from './Components/Employees/Subordinates';

//Import Auth Context
import { useAuth } from '../../Context/AuthHook'; //Responsible For Rendering Components For User's Based On Their Role
import AddItem from './Components/AddItem/AddItem';
import { useState } from 'react';

//Welcome Page Component
function Welcome() {

    const[trigger, setTrigger] = useState(0)

    //Loaded Features From The Auth Hook
    const { auth, logout } = useAuth()

    //HTML That Dynamiccally Renders Based On The User's Role
    return (
        <section className="max-w-screen-xl mx-auto px-5">
        
            {/* Dynamic Welcome Header */}
            <h1 className="text-4xl font-bold text-center mb-8">
                {auth === "Employee"
                    ? "Welcome to OFS Employee Dashboard"
                    : auth === "Manager"
                    ? "Welcome to OFS Manager Dashboard"
                    : "Welcome to OFS!"}
            </h1>
    
            {/* Featured Products Section for Customers */}
            <Carousel auth = {auth}></Carousel>

    
            {/* Categories Section */}
            <Categories auth={auth} logout={logout} ></Categories>
     
    
            <hr className="border-t border-gray-300 my-10" />
    
            {/* Robot Section */}
            <RobotArea trigger = {trigger} setTrigger = {setTrigger} auth={auth} logout={logout} ></RobotArea>
            
            {/* Transactions Section for Employees and Managers */}
            <TransactionArea trigger = {trigger} setTrigger = {setTrigger} auth={auth} logout={logout} ></TransactionArea>

            {/* Employees Section for Managers */}
            <SubordinatesArea auth={auth} logout={logout} ></SubordinatesArea>

            {/*Add Items */}
            <AddItem auth={auth}></AddItem>

        </section>
    );
    
}

export default Welcome;
