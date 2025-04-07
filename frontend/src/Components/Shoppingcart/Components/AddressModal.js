import React from 'react';

//Address Modal
export const AddressModal = ({ onSubmit, onCancel, onClose, children }) => {

  //HTML For Address Modal
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        {/* Close Button */}
        <div className="flex justify-end">
          <button className="text-3xl font-bold text-gray-600 hover:text-black" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="content">{children}</div>

        {/* Action Buttons */}
        <div className="flex justify-evenly mt-4">
          <button
            className="px-6 py-2 rounded-md bg-emerald-400 hover:bg-emerald-500 text-white font-semibold border border-black"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button
            className="px-6 py-2 rounded-md bg-red-400 hover:bg-red-500 text-white font-semibold border border-black"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
