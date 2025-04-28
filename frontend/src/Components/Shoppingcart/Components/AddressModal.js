//Address Modal
export const AddressModal = ({ submitHandle, onCancel, onClose }) => {

  return (

    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

      <div className="bg-white pt-2 p-6 rounded-lg shadow-xl w-96">

        <div className="flex justify-between">

          <h2 className="flex items-center text-xl pl-1">

            New Address

          </h2>

          <button

            className="py-2 text-3xl font-bold text-gray-600 hover:text-black"

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

              type="button"

              className="px-8 py-2 rounded-md bg-red-400 hover:bg-red-500 text-white font-semibold border border-red-400"

              onClick={onCancel}

            >

              Cancel

            </button>

            <button

              type="submit"

              className="px-8 py-2 rounded-md bg-green-400 hover:bg-green-500 text-white font-semibold border border-green-500"

            >

              Submit

            </button>



          </div>

        </form>

      </div>

    </section>

  );

};