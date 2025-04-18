//Import Custom Components
import Categories from './Components/Categories/Category'

import Carousel from './Components/Carousel/Carousel';

import RobotArea from './Components/Robot/Robots';

import TransactionArea from './Components/Transactions/TransactionsTable'; 

import SubordinatesArea from './Components/Employees/Subordinates';

//Import Auth Context
import { useAuth } from '../../Context/AuthHook'; 

import AddItem from './Components/AddItem/AddItem';

import { useState } from 'react';

//Welcome Page Component
function Welcome() {

    const[trigger, setTrigger] = useState(0)

    const { auth, logout } = useAuth()

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
            
            {auth === "Employee" || auth === "Manager"? (<hr className="border-t border-gray-300 my-10" />):null}

            {/* Transactions Section for Employees and Managers */}
            <TransactionArea trigger = {trigger} setTrigger = {setTrigger} auth={auth} logout={logout} ></TransactionArea>

            {auth === "Employee" || auth === "Manager"? (<hr className="border-t border-gray-300 my-10" />):null}

            {/* Employees Section for Managers */}
            <SubordinatesArea auth={auth} logout={logout} ></SubordinatesArea>

            {auth === "Manager"? (<hr className="border-t border-gray-300 my-10" />):null}

            {/*Add Items */}
            <AddItem auth={auth}></AddItem>

        </section>
        
    );
    
}

export default Welcome;
