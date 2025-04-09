//Used to create a dynamic input
const TextEntryBox = ({ value, onChange, type, ...props }) => {
    return (
      <>
          <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            {...props} 
          />
      </>
    );
  };

export default TextEntryBox;