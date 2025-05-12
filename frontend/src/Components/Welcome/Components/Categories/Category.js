import { Link } from "react-router-dom";

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
export default function Categories({ auth }) {

  const categories = [

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

  let categoriesJSX = []

  for (let i = 0; i < categories.length; i++) {

    categoriesJSX.push(

      <Link key={categories[i].link} to={`/search/category/${categories[i].link}`}>

        <Category imageSrc={categories[i].image} categoryName={categories[i].name} />

      </Link>

    )

  }

  return (

    <article className="w-auto h-auto mx-auto px-8 pt-8 pb-8">

      <h2 className="text-4xl text-center font-semibold mx-4 mb-4">

        {auth === "Employee" || auth === "Manager"

          ? "Manage Categories"

          : "Browse Categories"

        }

      </h2>

      {/*
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-3 justify-center border-2 border-black">
        {categoriesJSX}
      </div>
      */}

      <div className="overflow-hidden relative rounded-lg overflow-x-auto pb-4">

        <div className="flex transition-transform ease-out duration-500 gap-4 px-2 items-center"
          style={{ width: (categoriesJSX.length * 155) + 10 }}
        >
          {categoriesJSX}

        </div>

      </div>





    </article>

  )

}


// Category
const Category = ({ imageSrc, categoryName }) => {

  return (

    <div className="flex flex-col w-[140px] h-[200px] items-center text-center mt-8 hover:scale-110 hover:-translate-y-3 transition-all duration-300 ease-in-out">

      <div className="h-32 w-32 rounded-lg ring-1 ring-black hover:ring-green-500 overflow-hidden">  {/* Increased size to make it more square */}

        <img
          src={imageSrc}
          alt={categoryName}
          className="w-full h-full object-cover"
        />
      </div>


      <p className="mt-2 text-xl font-semibold text-gray-800 text-center">{categoryName}</p>

    </div>

  );

};