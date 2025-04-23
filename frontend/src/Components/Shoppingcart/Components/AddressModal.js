//Address Modal
export const AddressModal = ({ submitHandle, onCancel, onClose }) => {

  return (

    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

      <div className="bg-white p-6 rounded-lg shadow-xl w-96">

        <div className="flex justify-end">

          <button

            className="text-3xl font-bold text-gray-600 hover:text-black"

            onClick={onClose}

          >

            &times;
            
          </button>

        </div>

        <form onSubmit={submitHandle} className="space-y-4">

          <div className="flex space-x-2">

            <input

              type="text"

              name="Name"

              minLength={2}
              
              maxLength={255}

              id="name"

              className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              
              placeholder="Custom Name"

              required

            />

          </div>

          <div className="flex space-x-2">

            <input

              type="text"

              name="Address"

              minLength={2}
              
              maxLength={255}

              className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              
              placeholder="Address"

              required

            />

          </div>

          <div className="flex space-x-2">

            <input

              type="text"

              name="City"

              value="San Jose"

              readOnly

              className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 bg-gray-100"

              required

            />

            <input

              type="text"

              name="State"

              value="CA"

              readOnly

              className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 bg-gray-100"

              required

            />

            <input

              type="text"

              name="Zip"

              className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              
              placeholder="ZIP"
              
              required

            />

          </div>

          <div className="flex justify-evenly pt-4">

            <button

              type="submit"

              className="px-6 py-2 rounded-md bg-emerald-400 hover:bg-emerald-500 text-white font-semibold border border-black"
            
            >

              Submit

            </button>

            <button

              type="button"

              className="px-6 py-2 rounded-md bg-red-400 hover:bg-red-500 text-white font-semibold border border-black"

              onClick={onCancel}

            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </section>

  );

};