import { UpdateEmployee } from "../Components/UpdateEmployee/UpdateEmployee"
import { useLocation } from "react-router-dom";

export function UpdateEmployeePage(){
    const location = useLocation();
    console.log("location", location.state)
    const subordinate = location.state;
    return(<UpdateEmployee employee={subordinate}></UpdateEmployee>)
}