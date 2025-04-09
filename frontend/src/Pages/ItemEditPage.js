import ItemEdit from "../Components/ItemEdit/ItemEdit";
import { useLocation } from "react-router-dom";
export function ItemEditPage() {
    const location = useLocation();
    const item = location.state || null; 
    return (
            <ItemEdit item = {item} />
    );
}