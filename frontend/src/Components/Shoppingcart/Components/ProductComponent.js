import "./ProductComponent.css"
import carrot from "./Images/carrot.png"
function ProductComponent(){
    return (
        <div className="Product-Component">
            <div className="checkbox-image-container">
                <input type="checkbox" className="check"></input>
                <img className="product-image" src={carrot}></img>
            </div>
            <div className="Product-Information">
                <h1>Product Name</h1>
                <h3>Product Distributor</h3>
                <h3>Quantity</h3>
                <h3>Stock</h3>
            </div>
            <div className="Product-Information-Cost-Weight">
                <h2>Cost: </h2>
                <h2>Weight:</h2>
            </div>
            
        </div>
    )
}
export default ProductComponent;