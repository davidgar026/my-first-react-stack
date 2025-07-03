import React, { useState, useEffect } from "react";
import axios from "axios";
import About from "./About";
import Form from "./Form";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Navbar() {
  const [allData, setAllData] = useState("");

  useEffect(() => {
      const fetchData = async() => {
        try{
          const response = await axios.get("http://localhost:4000/api/getData");
          setAllData(response.data)
        }catch(err){
          throw err
        }
      }
      
      fetchData();
  }, []);



  return (
    <Router>
      <nav className="text-[#000000] text-xl flex mr-4 justify-end items-center pr-10">
        {allData.length == 0  ? null : <Link to="/add">Add</Link>}
        <Link className="p-5" to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/add" element={<Form />}></Route>
        <Route path="/about" element={<About />} />
      </Routes>
      
    </Router>
  );
}



export default Navbar;
