import React from 'react';


export const PaymentModal = ({onSubmit, onCancel, onClose, children}) => {
    return(
        <div className="flex">
            <div className="flex flex-col rounded-md border-2 border-gray-400 border-solid">
                <div className="flex justify-end px-2 text-3xl">
                    <p className="" onClick={() => onClose()}>&times;</p>
                </div>
                <div className="content">
                    {children}
                </div>
                <div className="flex flex-row justify-evenly m-2 mt-4">
                    <button className="px-6 py-2 rounded-md hover:bg-emerald-300 border-2 border-black-800 border-solid" onClick={() => onSubmit()}>Submit</button>
                    <button className="px-6 py-2 rounded-md hover:bg-red-300 border-2 border-black-800 border-solid" onClick={() => onCancel()}>Cancel</button>
                </div>
            </div>
        </div>
    );
}