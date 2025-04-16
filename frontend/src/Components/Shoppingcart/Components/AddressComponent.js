import axios from "axios";

import {useAuth} from "../../../Context/AuthHook"

import { useNavigate } from "react-router-dom";

import { validateAddress, validateName} from "../../Utils/Formatting";

//The Address Block Containing Information And Remove
function AddressComponent({address,setAddress,}){

    const {logout} = useAuth()

    const navigate = useNavigate()

    const clickAddressRemove = () => {
        
        if(address.Name=="In Store Pickup"){

          alert("Can't delete store")

          return; 

        }

        if(!validateName(address.Name)){

          alert("Invalid Input")

          return; 

        }

        const token = localStorage.getItem('accessToken');

        if (!token) {

          alert('Login Information Not Found');
    
          logout()
    
          navigate('/login')
    
          return;
    
        }

        if(!validateAddress(address.Address)){
          
          alert("Invalid Address")
          
          return

        }

        axios.delete(

          `http://localhost:3301/api/address/address/${address.Address}`,

          {

            headers: {

              Authorization: `Bearer ${token}`

            }

          }

        )

          .then((response) => {

            alert("Address Removed");
            
            setAddress(addressList => {

                return addressList.filter((a) => a.Address !== address.Address);

            });

          })

          .catch((error) => {

            if (error.response?.status === 401) {

              alert("You need to login again!");

              logout();

              navigate('/login')

            }else{

                alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);

            }

          });

      };
      

    return (

        <div className="flex w-3/4 px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border-2 border-gray-900 border-solid">

            <div className="flex-col nowrap w-11/12">

                <div className="flex">

                    <h2>{address.Name}</h2>

                </div>

                <div class="text-gray-600 font-thin ">

                    <p>{address.Address}</p>

                </div>

            </div>

            <span className="hover:underline" onClick={clickAddressRemove}>Remove</span>

        </div>

    )

}

export default AddressComponent;