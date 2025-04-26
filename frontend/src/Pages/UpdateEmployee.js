import { UpdateEmployee } from "../Components/UpdateAddEmployee/UpdateEmployee"
import { useLocation } from "react-router-dom";

export function UpdateEmployeePage(){

    const location = useLocation();

    const subordinate = location.state;

    return(<UpdateEmployee employee={subordinate}></UpdateEmployee>)
    
}