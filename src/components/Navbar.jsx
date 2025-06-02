import React from "react";
import About from "./About";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Navbar() {
  return (
    <Router>
      <nav className="text-[#DDA853] text-xl flex mr-4 justify-end items-center pr-10">
        <Link to="/about">About</Link>
      </nav>
    </Router>
  );
}



export default Navbar;
