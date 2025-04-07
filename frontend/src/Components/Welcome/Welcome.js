//Category Images

import bakeryAndBreadImage from './CategoryImages/bakeryandbread.jpg';
import beverages from './CategoryImages/beverages.jpg';
import dairyAndEggs from './CategoryImages/dairyeggs.webp';
import freshProduce from './CategoryImages/freshproduce.webp';
import frozenFoods from './CategoryImages/frozenfoods.jpg';
import healthAndWellness from './CategoryImages/healthandwellness.jpg';
import meatAndSeafood from './CategoryImages/meatseafood.webp';
import pantryStaples from './CategoryImages/pantrystaples.jpg';
import snacksAndSweets from './CategoryImages/snacksandsweets.jpg';

//React Functions
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import FeaturedProductCard from './Components/FeaturedProductCard';
import CategoryCard from './Components/Category';
import Robots from './Components/Robots';

//Import axios
import axios from 'axios';

import WelcomesearchIcon from '../Navbar/NavbarImages/searchIcon.jpg';
//Import Custom Components
import TransactionsTable from './Components/TransactionsTable';
import Subordinates from './Components/Subordinates';
import { useAuth } from '../../Context/AuthHook';

import { useNavigate } from 'react-router-dom';

//Welcome Page Component
function Welcome() {
    const navigate = useNavigate()
    //loaded features
    const { auth, logout } = useAuth()
    const [loadedFeatured, setFeatured] = useState([])

    const [transactionSearchInput, setTransactionSearchInput] = useState("");
    const [employeeSearchInput, setEmployeeSearchInput] = useState("");
    
    useEffect(() => {
        axios.get("http://localhost:3301/api/inventory/featured")
            .then((results) => {
                setFeatured(results.data);
            })
            .catch((error) => {
                if (error.response?.data?.error) {
                    alert(`Error Status ${error.status}: ${error.response.data.error}`);
                } else {
                    alert("Backend Down");
                }
            });
    }, []);
    



    //Carousel Index
    const [index, changeIndex] = useState(0);

    //Sample Featured Items

    //Carousel Left Click
    const handleLeftClick = () => {
        changeIndex((index + 1) % loadedFeatured.length);
    };

    //Carousel Right Click
    const handleRightClick = () => {
        if(index - 1 === -1){
            changeIndex(loadedFeatured.length - 1);
            return;
        }
        changeIndex((index - 1) % loadedFeatured.length);
    };

    const clickTransactionSearch = (e) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        console.log("tramsactopm " , transactionSearchInput);
        axios.post(
            `http://localhost:3301/api/transaction/transactions/id`,
            {
                TransactionID: transactionSearchInput
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            if (response.data.length === 0) {
                alert("No transaction found with that ID.");
                return;
            }
            console.log(response.data);
            navigate("/transaction/view", { state: response.data[0] });
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.status}: ${error.response.data.error}`);
            }
        });
    }

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
            {(auth === null || auth === "Customer") && (
                <div className="text-center mb-10">
                    <h2 className="text-2xl mb-4">Featured Products</h2>
                    <div className="flex items-center justify-center gap-4 overflow-x-auto p-3">
                        <button
                            className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700"
                            onClick={handleLeftClick}
                        >
                            ←
                        </button>
                        {loadedFeatured.length > 0 ? (
                            [...Array(3)].map((_, iter) => {
                                const tempIndex = (index + iter) % loadedFeatured.length;
                                return (
                                    <FeaturedProductCard
                                        key={loadedFeatured[tempIndex].ItemID}
                                        item={loadedFeatured[tempIndex].ItemID}
                                        imageSrc={loadedFeatured[tempIndex].ImageLink}
                                        productName={loadedFeatured[tempIndex].ProductName}
                                    />
                                );
                            })
                        ) : (
                            <p>Loading featured products...</p>
                        )}
                        <button
                            className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700"
                            onClick={handleRightClick}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
    
            {/* Categories Section */}
            <section className="mt-10">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
                    {auth === "Employee" || auth === "Manager"
                        ? "Manage Categories"
                        : "Browse Categories"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-3 justify-center">
                    {[
                        { link: "Fresh-Produce", image: freshProduce, name: "Fresh Produce" },
                        { link: "Dairy-and-Eggs", image: dairyAndEggs, name: "Dairy and Eggs" },
                        { link: "Meat-and-Seafood", image: meatAndSeafood, name: "Meat and Seafood" },
                        { link: "Bakery-and-Bread", image: bakeryAndBreadImage, name: "Bakery and Bread" },
                        { link: "Pantry-Staples", image: pantryStaples, name: "Pantry Staples" },
                        { link: "Beverages", image: beverages, name: "Beverages" },
                        { link: "Snacks-and-Sweets", image: snacksAndSweets, name: "Snacks and Sweets" },
                        { link: "Health-and-Wellness", image: healthAndWellness, name: "Health and Wellness" },
                        { link: "Frozen-Foods", image: frozenFoods, name: "Frozen Foods" },
                    ].map((category) => (
                        <Link key={category.link} to={`/search/category/${category.link}`}>
                            <CategoryCard imageSrc={category.image} categoryName={category.name} />
                        </Link>
                    ))}
                </div>
            </section>
    
            <hr className="border-t border-gray-300 my-10" />
    
            {/* Transactions Section */}
            {auth === "Employee" || auth === "Manager" ? (
                <section>
                    <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Robot Fleet</h2>
                    <Robots></Robots>
                    <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Add Robot</h2>
                    <div className="mb-10 flex justify-center items-center h-full">
                        <button onClick = {()=>{navigate('/addrobot')}} className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Add Robot
                        </button>
                    </div>
                </section>
            ):null}
            
            {auth === "Employee" || auth === "Manager" ? (
            <section className="w-[100%] mx-auto px-5 py-5 bg-gray-200 rounded-lg shadow-md mb-20">

                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Current Transactions</h2>
                <TransactionsTable />
    
                {/* Manager-Only Search & Employee Management */}
                {auth === "Manager" && (
                    <div className="flex flex-col items-center gap-10 py-10">

                        {/* Transaction Search */}
                        <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Transaction Search</h2>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <input
                            onChange={(e) => setTransactionSearchInput(e.target.value)}
                            value={transactionSearchInput}
                            type="text"
                            placeholder="Search Transactions"
                            className="flex-grow px-4 py-2 text-lg focus:outline-none"
                            />
                            <img onClick = {clickTransactionSearch} src={WelcomesearchIcon} alt="search icon" className="w-5 h-5" />
                        </div>
                        </div>
                            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Employees</h2>
                            <Subordinates></Subordinates>
                        <div>
                        </div>
                            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Add Employee</h2>
                            <div className="mb-10 flex justify-center items-center h-full">
                                <button onClick = {()=>{navigate('/addemployee')}} className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                    Add Employee
                                </button>
                            </div>
                        <div>


                        </div>       
                  </div>
                  
                )}
            </section>) : null}
            
        </section>
    );
    
}

export default Welcome;
