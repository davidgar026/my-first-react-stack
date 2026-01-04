import React, { useState, useEffect } from "react";
import axios from "axios";

//Note: Navbar should only render links and not routes. That should be in App.jsx

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Navbar() {
  const [ allData, setAllData ] = useState([]);

  useEffect(() => {
      const fetchData = async() => {
        try{
          const response = await axios.get("/api/getData");
          setAllData(response.data)
        }catch(err){
          throw err
        }
      }
      
      fetchData();
  }, []);



  return (
    <>
      <nav className="text-[#000000] text-xl flex justify-center md:justify-end items-center gap-6 px-6 py-3 ">
        {/* {allData.length == 0  && <Link to="/add">Add</Link>} */}
        <Link to="/add">Add</Link>
        <Link className="p-5" to="/home">Home</Link>
      </nav>
    </>
  );
}



export default Navbar;
