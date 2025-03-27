import React from "react";
import {useState} from 'react';

const TextEntryBox = ({ value, onChange, type = 'text', multiline = false, ...props }) => {
    return (
      <>
        {multiline ? (
          <textarea 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            {...props} 
          />
        ) : (
          <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            {...props} 
          />
        )}
      </>
    );
  };

export default TextEntryBox;