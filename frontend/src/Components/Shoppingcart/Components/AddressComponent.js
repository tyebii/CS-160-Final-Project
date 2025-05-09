import axios from "axios";

import { validateAddress, validateName } from "../../Utils/Formatting";

import { useErrorResponse } from '../../Utils/AxiosError';

//The Address Block Containing Information And Remove
function AddressComponent({ address, setAddress, }) {

  const { handleError } = useErrorResponse();

  //Removes The Address
  const clickAddressRemove = async () => {

    try {

      if (address.Name === "In Store Pickup") {

        alert("Can't delete store");

        return;

      }

      if (!validateName(address.Name, "Name")) {

        return;

      }

      if (!validateAddress(address.Address, "Address")) {

        return;

      }

      await axios.delete(

        `http://localhost:3301/api/address/address/${address.Address}`,

        {

          withCredentials: true,

          headers: { 'Content-Type': 'application/json' }

        }

      );

      alert("Address Removed");

      setAddress((addressList) =>

        addressList.filter((a) => a.Address !== address.Address)

      );

    } catch (error) {

      handleError(error);

    }

  };

  return (

    <div className="flex w-full px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border border-gray-900 border-solid">

      <div className="flex-col nowrap w-11/12">

        <div className="flex">

          <h2>{address.Name}</h2>

        </div>

        <div className="text-gray-600 font-thin ">

          <p>{address.Address}</p>

        </div>

      </div>

      <span className="text-sm hover:underline hover:text-red-500" onClick={clickAddressRemove}>Remove</span>

    </div>

  )

}

export default AddressComponent;