import { useAuth } from "../../Context/AuthHook";

import { useNavigate } from 'react-router-dom';

export const useErrorResponse = () => {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleError = (error) => {

    if (error?.response?.status === 401) {

      alert("You need to log in again.");

      logout();  

      navigate('/login');  

    } else {

      const message = error?.response?.data?.error || "An unexpected error occurred.";

      alert(`Error: ${message}`);  

    }

  };

  return { handleError }; 

}
