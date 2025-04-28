
import { useNavigate } from 'react-router-dom';

//Add Item
export default function AddItem({auth}) {

    const navigate = useNavigate()
    
    return (

        auth === "Manager" ? (

            <article className="w-[100%] mx-auto px-5 py-5 bg-gray-200 rounded-lg shadow-md mb-20">

                <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Add Item</h2>

                <div className="mb-10 flex justify-center items-center h-full">

                    <button onClick={() => navigate('/additem')} className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors">

                        Add Item

                    </button>

                </div>

            </article>

        ) : null

    );
    
}