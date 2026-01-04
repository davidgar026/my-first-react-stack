import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./src/components/Layout/Header.jsx";
import Navbar from "./src/components/Layout/Navbar.jsx";
import Footer from "./src/components/Layout/Footer.jsx";
import Feed from "./src/components/Posts/Feed.jsx";
import LandingPage from "./src/components/Pages/LandingPage.jsx";
import Form from "./src/components/Form.jsx"; // add .jsx if needed
import About from "./src/components/Pages/About.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { api } from "./utils/api.js";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/?auth=login" replace />;
}

export default function App() {
  const { user, loading } = useAuth();       // hook 1
  const [allData, setAllData] = useState(""); // hook 2

  console.log("user = ", user);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/getData"); // baseURL '/api' in api.js
        setAllData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading…</div>;   // branch AFTER hooks

  return (
    <Router>
      <div className="h-full grid grid-cols-2 col-span-2 grid-rows-[80px_1fr_60px] bg-[#F2EFE7]">
        <Header />
        <Routes>
          <Route path="/" element={<div className="h-full flex flex-wrap justify-center col-span-2"><LandingPage /></div>}/>
          <Route path="/feed" element={<div className=" flex flex-wrap justify-center col-span-2"><Feed /></div>}/>
          <Route path="/add" element={<Form />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <div className="grid col-span-2">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
