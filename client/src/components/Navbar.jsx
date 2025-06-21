import React from "react";
import About from "./About";
import AddPost from "./AddPost";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Navbar() {
  return (
    <Router>
      <nav className="text-[#000000] text-xl flex mr-4 justify-end items-center pr-10">
        <Link to="/add">Add</Link>
        <Link className="p-5" to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/add" element={<AddPost />}></Route>
        <Route path="/about" element={<About />} />
      </Routes>
      
    </Router>
  );
}



export default Navbar;
