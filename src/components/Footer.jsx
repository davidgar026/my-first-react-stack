import React from "react";

function Footer(){
    const currYear = new Date().getFullYear();
return (
<footer className="flex justify-center items-center border" >
   <p className="text-xs">Copyright ⓒ {currYear}</p>
</footer>)
}

export default Footer;