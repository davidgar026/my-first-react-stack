import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Content from "./src/components/Content";
import Navbar from "./src/components/Navbar";
import Form from "./src/components/Form";
import About from "./src/components/About";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  const [allData, setAllData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/getData");
        setAllData(response.data);
      } catch (err) {
        throw err;
      }
    };

    fetchData();
  }, []);

  return (
    // <Router>
    //   <div className="grid grid-cols-2 col-span-2 grid-rows-[80px_1fr_60px]  sm:min-h-screen bg-[#F2EFE7]">
    //     <Header />
    //     <nav className="text-[#000000] text-xl flex mr-4 justify-end items-center pr-10">
    //       {allData.length == 0 ? null : <Link to="/add">Add</Link>}
    //       <Link className="p-5" to="/about">
    //         About
    //       </Link>
    //     </nav>
    //     <Routes>
    //       <Route path="/add" element={<Form />}></Route>
    //       <Route path="/about" element={<About />} />
    //     </Routes>
    //     <div className="grid col-span-2">
    //       <Content />
    //     </div>
    //     <div className="grid col-span-2">
    //       <Footer />
    //     </div>
    //   </div>
    // </Router>
    <Router>
      <div className="grid grid-cols-2 col-span-2 grid-rows-[80px_1fr_60px]  sm:min-h-screen bg-[#F2EFE7]">
        <Header />
        <nav className="text-[#000000] text-xl flex mr-4 justify-end items-center pr-10">
          {allData.length == 0 ? null : <Link to="/add">Add</Link>}
          <Link className="p-5" to="/about">
            About
          </Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="grid col-span-2">
                  <Content />
                </div>
              </>
            }
          />
          <Route 
            path="/add"
            element={
              <Form />
            }
          />
        </Routes>

        <div className="grid col-span-2">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
