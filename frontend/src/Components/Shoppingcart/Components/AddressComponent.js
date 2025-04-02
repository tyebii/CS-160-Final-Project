//Import Auth Context and Axios
import axios from "axios";
import {useAuth} from "../../../Context/AuthHook"

//Address Component
function AddressComponent({address,setAddress,addressList}){
    //Get Logout 
    const {logout} = useAuth()

    //When The Remove Option Of Address Is Clicked
    const clickAddressRemove = () => {

        if(!address.Name){
          alert("Can't delete non-store")
          return; 
        }

        if(address.Name=="In Store Pickup"){
            alert("Can't delete store")
            return; 
        }

        //Get The Token From The Local Storage
        const token = localStorage.getItem('accessToken');

        //If There Is No Token Alert The User and Log Them Out
        if (!token) {
          alert('No token found');
          logout()
          return;
        }
        
        //Delete The Address
        axios
          .delete(
            `http://localhost:3301/api/address`,
            {
              data: { Address: address.Address },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            alert("Address Removed");
            
            //Remove Item From Address List
            setAddress(addressList => {
                return addressList.filter((a) => a.Address !== address.Address);
              });
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              alert("Need to log back in");
              logout();
            } else {
              alert(error.message);
            }
          });
      };
      
    //HTML
    return (
        <div className="flex w-3/4 px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border-2 border-gray-900 border-solid">
            <div className="flex-col nowrap w-11/12">
                <div className="flex">
                    <h2>{address.Name}</h2>
                </div>
                <div class="text-gray-600 font-thin ">
                    <p>{address.Address}</p>
                    <p>{address.City}, {address.State} {address.Zip}</p>
                </div>
            </div>
            <span className="hover:underline" onClick={clickAddressRemove}>Remove</span>
        </div>
    )
}
export default AddressComponent;