//Used to create a dynamic input
const TextEntryBox = ({ value, onChange, type, ...props }) => {
    
  return (
      <>

          <input 

            required

            type={type}

            value={value}

            onChange={(e) => onChange(e.target.value)} 

            className=" border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg placeholder-gray-500 outline-none transition-all duration-200"

            {...props} 

          />

      </>

    );

  };

export default TextEntryBox;