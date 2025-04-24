import axios from "axios";

import { validateAddress, validateName} from "../../Utils/Formatting";

//Error Message Hook
import { useErrorResponse } from '../../Utils/AxiosError';

//The Address Block Containing Information And Remove
function AddressComponent({address,setAddress,}){
  
    const { handleError } = useErrorResponse(); 

    const clickAddressRemove = () => {
        
        if(address.Name=="In Store Pickup"){

          alert("Can't delete store")

          return; 

        }

        if(!validateName(address.Name)){

          alert("Invalid Input")

          return; 

        }

        if(!validateAddress(address.Address)){
          
          alert("Invalid Address")
          
          return

        }

        axios.delete(

          `http://localhost:3301/api/address/address/${address.Address}`,

          {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' }

          }

        )

          .then((response) => {

            alert("Address Removed");
            
            setAddress(addressList => {

                return addressList.filter((a) => a.Address !== address.Address);

            });

          })

          .catch((error) => {

            handleError(error)

          });

      };
      

    return (

        <div className="flex w-3/4 px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border-2 border-gray-900 border-solid">

            <div className="flex-col nowrap w-11/12">

                <div className="flex">

                    <h2>{address.Name}</h2>

                </div>

                <div className="text-gray-600 font-thin ">

                    <p>{address.Address}</p>

                </div>

            </div>

            <span className="hover:underline" onClick={clickAddressRemove}>Remove</span>

        </div>

    )

}

export default AddressComponent;