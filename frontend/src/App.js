import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';

function App() {
  useEffect(() => {
    // Example Fetch
    fetch('http://localhost:3301/api/greet')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []); 

  return (
    <div className="App">
      <Navbar></Navbar>
    </div>
  );
}

export default App;
