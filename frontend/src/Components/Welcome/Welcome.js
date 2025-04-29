import Categories from './Components/Categories/Category'

import Carousel from './Components/Carousel/Carousel';

import RobotArea from './Components/Robot/Robots';

import TransactionArea from './Components/Transactions/TransactionsTable';

import SubordinatesArea from './Components/Employees/Subordinates';

import { useAuth } from '../../Context/AuthHook';

import AddItem from './Components/AddItem/AddItem';

import { useState } from 'react';

import backdrop from './backdrop.png';
import landingpage from './AdImages/LandingPage.png'
import ad_1 from './AdImages/adcard_1.png'


import AdCarousel from './Components/Carousel/AdCarousel';

//Welcome Page Component
function Welcome() {

    const [trigger, setTrigger] = useState(0)

    const { auth, logout } = useAuth()

    const slides = [
        landingpage,
        ad_1
    ]

    return (

        <section

            className="w-full bg-cover bg-no-repeat"

            style={{ backgroundImage: `url(${backdrop})` }}

        >

            <div className=" w-full max-w-[80%] mx-auto mt-10 mb-10 bg-white p-8 rounded-2xl shadow-lg"
                style={{
                    background: "linear-gradient(rgb(255, 251, 236),rgb(255, 249, 214))",
                }}
            >

                {!auth || auth === "Customer" ? null : (

                    <h1 className="text-7xl mt-10 font-bold text-center mb-8">

                        {auth === "Employee"

                            ? "Welcome to OFS Employee Dashboard"

                            : auth === "Manager"

                                ? "Welcome to OFS Manager Dashboard"

                                : ""}

                    </h1>

                )}


                {!auth || auth === "Customer" ? (

                    <div

                        className="bg-cover bg-center rounded-lg shadow-xl mx-auto my-2 w-[960px] h-[400px] flex items-center justify-center"

                    >
                        <AdCarousel>
                            {slides.map((s) => (
                                <img src={s} className="min-w-[960px] h-[400px] object-cover" />
                            ))}
                        </AdCarousel>

                    </div>

                ) : null}



                {/* Featured Products Section for Customers */}
                <Carousel auth={auth}></Carousel>

                {/* Categories Section */}
                <Categories auth={auth} logout={logout} ></Categories>

                {auth === "Employee" || auth === "Manager" ? (<hr className="my-4 border-2 border-gray-300" />) : null}

                {/* Robot Section */}
                <RobotArea trigger={trigger} setTrigger={setTrigger} auth={auth} logout={logout} ></RobotArea>

                {auth === "Employee" || auth === "Manager" ? (<hr className="border-t border-black mt-10 mb-20" />) : null}

                {/* Transactions Section for Employees and Managers */}
                <TransactionArea trigger={trigger} setTrigger={setTrigger} auth={auth} logout={logout} ></TransactionArea>

                {auth === "Employee" || auth === "Manager" ? (<hr className="border-t border-black my-20" />) : null}

                {/* Employees Section for Managers */}
                <SubordinatesArea auth={auth} logout={logout} ></SubordinatesArea>

                {auth === "Manager" ? (<hr className="my-4 border-t border-gray-300 my-20" />) : null}

                {/*Add Items */}
                <AddItem auth={auth}></AddItem>

            </div>

        </section>

    );

}

export default Welcome;
