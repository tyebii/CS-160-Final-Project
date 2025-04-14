//Refactored By: [Matthew Delurio, 4/8/2025]
//Goals:
// 1. Refactor the code to make it more readable and maintainable.

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
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
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

//Category
const Category = ({ imageSrc, categoryName }) => {
  return (
    <div className="flex flex-col items-center text-center mt-5 hover:scale-105 hover:translate-y-2 transition-all duration-200 ease-in-out">
      <p className="text-lg font-bold mb-2">{categoryName}</p>
      <div className="p-3 border-2 border-gray-300 rounded-full bg-white shadow-md">
        <img
          src={imageSrc}
          alt={categoryName}
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
    </div>
  );
};


