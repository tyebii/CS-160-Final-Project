import './Welcome.css';
import Carrot from '../../../Components/Welcome/Images/carrot.png';
import Robot from './Images/robot.png'
import WelcomesearchIcon from "../../../Components/Navbar/NavbarImages/searchIcon.jpg"
import {Link } from "react-router-dom";
import CategoryCard from './Components/Category';
import RobotCard from './Components/Robots';
import TransactionsTable from '../Table/TransactionsTable';
import { useState} from 'react';

// todo: update links for manager
function ManagerWelcome(){
    // from navbar
    const [transactionSearchInput, setTransactionSearchInput] = useState("");
    const [employeeSearchInput, setEmployeeSearchInput] = useState("");

    function formatText(text){
        var sol = "";
        var i = 0
        while(i < text.length){
            if(text[i] === " "){
                while (i<text.length && text[i] === " "){
                    i++;
                }
                if (i==text.length){
                    return sol;
                }
                sol += "-";
            }
            else{
                sol += text[i];
                i +=1 
            }
        }
        return sol;
    }

    return (
        <div className="container">
            <div className="welcome">
                <h1>Welcome to OFS Manager Dashboard!</h1>
            </div>
            
            <div className="welcome-categories">
                <h2 className="section-title">Manage Products</h2>
                <div className="welcome-categories-grid">
                    <Link to = "/search/category/fresh-produce">
                        <CategoryCard imageSrc={Carrot} categoryName="Fresh Produce" />
                    </Link>
                    <Link to = "/search/category/dairy-and-eggs">
                        <CategoryCard imageSrc={Carrot} categoryName="Dairy and Eggs" />
                    </Link>
                    <Link to = "/search/category/meat-and-seafood">
                        <CategoryCard imageSrc={Carrot} categoryName="Meat and Seafood" />
                    </Link>
                    <Link to = "/search/category/bakery-and-bread">
                        <CategoryCard imageSrc={Carrot} categoryName="Bakery and Bread" />
                    </Link>
                    <Link to = "/search/category/pantry-staples">
                        <CategoryCard imageSrc={Carrot} categoryName="Pantry Staples" />
                    </Link>
                    <Link to = "/search/category/beverages">
                        <CategoryCard imageSrc={Carrot} categoryName="Beverages" />
                    </Link>
                    <Link to = "/search/category/snacks-and-sweets">
                        <CategoryCard imageSrc={Carrot} categoryName="Snacks and Sweets" />
                    </Link>
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={Carrot} categoryName="Health and Wellness" />
                    </Link>
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={Carrot} categoryName="Frozen Foods" />
                    </Link>
                </div>
                <hr></hr>
                <h2 className="section-title">Robot Management</h2>
                <div className="welcome-categories-grid">
                    <Link to = "/search/category/fresh-produce">
                        <RobotCard imageSrc={Robot} robotName="Robot 1" />
                    </Link>
                    <Link to = "/search/category/dairy-and-eggs">
                        <RobotCard imageSrc={Robot} robotName="Robot 2" />
                    </Link>
                    <Link to = "/search/category/meat-and-seafood">
                        <RobotCard imageSrc={Robot} robotName="Robot 3" />
                    </Link>
                    <Link to = "/search/category/bakery-and-bread">
                        <RobotCard imageSrc={Robot} robotName="Robot 4" />
                    </Link>
                    <Link to = "/search/category/pantry-staples">
                        <RobotCard imageSrc={Robot} robotName="Robot 5" />
                    </Link>
                    <Link to = "/search/category/beverages">
                        <RobotCard imageSrc={Robot} robotName="Robot 6" />
                    </Link>
                </div>
            </div>
            <div className="Transactions">
            <hr></hr>
                <h2 className="section-title"> View Transactions</h2>
                <div className="transactions-table">
                    <h3 className="subsection-title">Current Transactions</h3>
                    <TransactionsTable />
                </div>
                <div className="search">
                    <h3 className="subsection-title">Transaction Search</h3>
                    <div className='Welcome-Search-Container'>
                        <input  onChange={(e)=>{setTransactionSearchInput(e.target.value)}} value = {transactionSearchInput}  type="text" placeholder='Search Transactions'></input>
                        <Link to={transactionSearchInput !== "" ? `/search/transaction/${formatText(transactionSearchInput)}` : ""} className="WelcomeSearchIcon" onClick={()=>{setTransactionSearchInput("")}}>
                            <img src={WelcomesearchIcon} alt="search icon" />
                        </Link>
                    </div>
                    <h3 className="subsection-title">Manage Employees</h3> 
                    <div className='Welcome-Search-Container'>
                        <input  onChange={(e)=>{setEmployeeSearchInput(e.target.value)}} value = {employeeSearchInput}  type="text" placeholder='Search Employees'></input>
                        <Link to={employeeSearchInput !== "" ? `/search/employee/${formatText(employeeSearchInput)}` : ""} className="WelcomeSearchIcon" onClick={()=>{setEmployeeSearchInput("")}}>
                            <img src={WelcomesearchIcon} alt="search icon" />
                        </Link>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
}
export default ManagerWelcome;