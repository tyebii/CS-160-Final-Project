import ItemEdit from "../Components/ItemEdit/ItemEdit";
import ErrorBoundary from "../../Components/ErrorBoundary";
function ManagerItemEditPage(){
    return (
        <ErrorBoundary>
        <ItemEdit />
        </ErrorBoundary>
    );
}
export default ManagerItemEditPage;