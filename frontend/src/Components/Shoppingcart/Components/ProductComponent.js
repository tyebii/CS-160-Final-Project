import "./ProductComponent.css"
import carrot from "./CartImages/carrot.png"
function ProductComponent(){
    return (
        <div className="Product-Component">
            <div className="checkbox-image-container">
                <input type="checkbox" className="check"></input>
                <img className="product-image" src={carrot}></img>
            </div>
            <div className="Product-Information">
                <h1 className="font-bold text-2xl">Product Name</h1>
                <h3 className="text-xl">Product Distributor</h3>
                <h3 className="text-xl">Quantity</h3>
                <h3 className="text-xl">Stock</h3>
            </div>
            <div className="Product-Information-Cost-Weight">
                <h2 className="text-xl">Cost: </h2>
                <h2 className="text-xl">Weight:</h2>
            </div>
            
        </div>
    )
}
export default ProductComponent;