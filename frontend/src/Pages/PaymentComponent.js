function AddressComponent(){
    return (
        <div className="flex w-3/4 px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border-2 border-gray-900 border-solid">
            <div className="flex w-1/12 nowrap px-2 py-1">
                <input type="radio" className="w-4 h-4 rounded-sm bg-gray-200"></input>
            </div>
            <div className="flex-col nowrap w-11/12">
                <div className="flex">
                    <h2>MasterCard World Elite</h2>
                </div>
                <div class="text-gray-600 font-thin">
                    <p>****-****-****-3048</p>
                </div>
            </div>
        </div>
    )
}
export default AddressComponent;