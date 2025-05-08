//Import React Functions
import { Link } from "react-router-dom";

//Redirect Modal
export const RedirectModal = ({ submitHandle, onBack, onClose }) => {

    return (
  
      <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  
        <div className="bg-white py-2 px-4 rounded-lg shadow-xl w-98">
  
          <div className="flex justify-between">

            <h2 className="mt-2 text-xl align-text-bottom">
              Successfully Added to Cart!
            </h2>
  
            <button
  
              className="text-3xl font-bold text-gray-600 hover:text-black"
  
              onClick={onClose}
  
            >
  
              &times;
              
            </button>
  
          </div>
  
          <form onSubmit={submitHandle} className="flex">
  
            <div className="flex justify-between pt-4 gap-4">
  
              <button
  
                type="button"
  
                className="text-nowrap w-1/2 px-6 py-2 text-center rounded-md bg-gray-400 hover:bg-gray-500 text-white font-semibold"

                onClick={onBack}
              
              >
  
                Continue Shopping
  
              </button>
  
              <Link
                to="/shoppingcart"
  
                type="button"
  
                className="text-nowrap w-1/2 px-6 py-2 text-center rounded-md bg-green-500 hover:bg-green-700 text-white font-semibold"
  
              >
  
                Go to Checkout
  
              </Link>
  
            </div>
  
          </form>
  
        </div>
  
      </section>
  
    );
  
  };