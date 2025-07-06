import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import Content from "./src/components/Content"


function Header() {
  return (
      <header className="grid grid-cols-2 grid-rows-1 ">
      <h1 className="text-[#000000] text-4xl font-bold pt-4 pl-10 cursor-pointer"><Link to="/">PHshare</Link></h1>
    </header>
  );
}

export default Header;
