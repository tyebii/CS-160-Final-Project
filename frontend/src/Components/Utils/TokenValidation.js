import { useAuth } from "../../Context/AuthHook";

import { useNavigate } from 'react-router-dom';

export const useValidateToken = () => {

    const navigate = useNavigate()

    const { logout } = useAuth();

    const validateToken = () => {

        const token = localStorage.getItem('accessToken');

        if (!token) {

            alert('Login Information Not Found');

            logout();

            navigate('/login');

            return;

        }

        return token

    };

    return validateToken;

};