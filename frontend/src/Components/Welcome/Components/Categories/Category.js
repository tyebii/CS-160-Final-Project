//Import React Functions
import { Link } from "react-router-dom";

//Import Category Images :: Assumes That We Have A Set Of Fixed Categories
import bakeryAndBreadImage from '../../CategoryImages/bakeryandbread.jpg';

import beverages from '../../CategoryImages/beverages.jpg';

import dairyAndEggs from '../../CategoryImages/dairyeggs.webp';

import freshProduce from '../../CategoryImages/freshproduce.webp';

import frozenFoods from '../../CategoryImages/frozenfoods.jpg';

import healthAndWellness from '../../CategoryImages/healthandwellness.jpg';

import meatAndSeafood from '../../CategoryImages/meatseafood.webp';

import pantryStaples from '../../CategoryImages/pantrystaples.jpg';

import snacksAndSweets from '../../CategoryImages/snacksandsweets.jpg';

//Categories
export default function Categories({auth}) {

    //List Of Categories :: Assumption On Fixed Categories
    const categories =[

        { link: "Fresh-Produce", image: freshProduce, name: "Fresh Produce" },

        { link: "Dairy-and-Eggs", image: dairyAndEggs, name: "Dairy and Eggs" },

        { link: "Meat-and-Seafood", image: meatAndSeafood, name: "Meat and Seafood" },

        { link: "Bakery-and-Bread", image: bakeryAndBreadImage, name: "Bakery and Bread" },

        { link: "Pantry-Staples", image: pantryStaples, name: "Pantry Staples" },

        { link: "Beverages", image: beverages, name: "Beverages" },

        { link: "Snacks-and-Sweets", image: snacksAndSweets, name: "Snacks and Sweets" },

        { link: "Health-and-Wellness", image: healthAndWellness, name: "Health and Wellness" },

        { link: "Frozen-Foods", image: frozenFoods, name: "Frozen Foods" },

    ]
    
    //Array To Hold JSX
    let categoriesJSX = []

    //Iterate Over The Categories And Create A Card For Each Category
    for(let i = 0; i < categories.length; i++){

        categoriesJSX.push(

            <Link key={categories[i].link} to={`/search/category/${categories[i].link}`}>

                <Category imageSrc={categories[i].image} categoryName={categories[i].name} />

            </Link>

        )

    }

    //Return The JSX
    return(

      <article className="mt-10">

        <h2 className="text-center text-4xl mb-6 text-gray-800">

          {auth === "Employee" || auth === "Manager"

              ? "Manage Categories"

              : "Browse Categories"

          }

        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-3 justify-center">

          {categoriesJSX}

        </div>

      </article>

    )

}


// Category
const Category = ({ imageSrc, categoryName }) => {

  return (

<div className="flex flex-col items-center text-center mt-10 hover:scale-110 hover:-translate-y-3 transition-all duration-300 ease-in-out">
  
  <div className="p-4 bg-black rounded-lg shadow-xl hover:shadow-3xl transition-shadow duration-300">
    
    <div className="w-64 h-64 rounded-lg overflow-hidden">  {/* Increased size to make it more square */}
      
      <img
        src={imageSrc}
        alt={categoryName}
        className="w-full h-full object-cover"
      />
    </div>

  </div>

  <p className="mt-6 text-3xl font-bold text-gray-800">{categoryName}</p>

</div>



  );
  
};







