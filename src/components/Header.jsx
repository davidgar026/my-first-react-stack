import React from "react";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="grid grid-cols-2 grid-rows-1 border-2">
      <h1 className="text-[#DDA853] text-4xl font-bold pt-4 pl-10 cursor-pointer">PHshare</h1>
      <Navbar  className="justify-start"/>
    </header>
  );
}

export default Header;
