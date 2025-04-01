function AddressComponent({address}){
    return (
        <div className="flex w-3/4 px-2 pt-2 pb-2 rounded-md hover:bg-gray-100 hover:shadow-xl border-2 border-gray-900 border-solid">
            <div className="flex-col nowrap w-11/12">
                <div className="flex">
                    <h2>{address.Name}</h2>
                </div>
                <div class="text-gray-600 font-thin ">
                    <p>{address.Address}</p>
                    <p>{address.City}, {address.State} {address.Zip}</p>
                </div>
            </div>
        </div>
    )
}
export default AddressComponent;