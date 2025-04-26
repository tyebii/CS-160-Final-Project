import { useAuth } from "../../Context/AuthHook";

import { useNavigate } from 'react-router-dom';

export const useErrorResponse = () => {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleError = (error) => {

    if (error?.response?.status === 401 || error?.response?.status === 403) {

      logout();  

      navigate('/login');  

    } else {

      const message = error?.response?.data?.error || "An unexpected error occurred.";

      alert(`Error: ${message}`);  

    }

  };

  return { handleError }; 

}
