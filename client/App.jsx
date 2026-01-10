import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./src/components/Layout/Header.jsx";
import Navbar from "./src/components/Layout/Navbar.jsx";
import Footer from "./src/components/Layout/Footer.jsx";
import Feed from "./src/components/Posts/Feed.jsx";
import LandingPage from "./src/components/Pages/LandingPage.jsx";
import Form from "./src/components/Form.jsx"; // add .jsx if needed
import About from "./src/components/Pages/About.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { api } from "./utils/api.js";
import Modal from "./src/components/Modal";
import Login from "./src/components/Login";
import Signup from "./src/components/Signup";

export default function App() {
  const { login, signup, user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [allData, setAllData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [divID, setDivID] = useState(null);
  const [modalType, setModalType] = useState(null);
  
  

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

  console.log("user = ", user);


  //Open Modal for login or signup
  const handleClick = (name) => {
  if (name === "div 3" || !user) { 
    setShowModal(true);
    setModalType("form")
    setDivID(name);
  }
};

  //Close modal
  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setDivID(null);
  };

  //Handle form submission
  const handleFormSubmit = async (credentials) => {
    try {
      const mode = divID === "div 1" ? "login" : "signup";
      if (mode === "login") {
        await login(credentials);
      } else {
        await signup(credentials);
      }
      setShowModal(false);
      setDivID(null);
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed.");
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
      <div className="grid col-span-2 grid-rows-[80px_1fr_60px] bg-[#F2EFE7] min-h-screen">
        <Header
          handleClick={handleClick}
          onCloseModal={() => setShowModal(false)}
          onAddClick={() => handleClick("div 3")}
        />
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-wrap justify-center ">
                <LandingPage
                  handleClick={handleClick}
                  showModal={showModal}
                  divID={divID}
                  handleClose={handleClose}
                  handleFormSubmit={handleFormSubmit}
                  loading={loading}
                  user={user}
                />
                {/* Render the modal here so it's available on LandingPage */}
                <Modal open={showModal} onClose={handleClose}>
                  {divID === "div 1" ? (
                    <Login onClose={handleClose} onFormSubmit={handleFormSubmit} />
                  ) : (
                    <Signup onClose={handleClose} onFormSubmit={handleFormSubmit} />
                  )}
                </Modal>
              </div>
            }
          />
          <Route
            path="/feed"
            element={
            loading ? (
              <div>Loading...</div>
            ):
            user ? (
              <div className=" flex flex-wrap justify-center col-span-2">
                <Feed
                  handleClick={handleClick}
                  showAddModal={showModal}
                  divID={divID}
                  handleClose={handleClose}
                  handleFormSubmit={handleFormSubmit}
                  loading={loading}
                  user={user}
                />
                
              </div>
            ) : (
              <Navigate to="/" replace />
            )
              
            }
          />
          <Route path="/add" element={<Form />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <div className="grid col-span-2">
          <Footer />
        </div>
      </div>
  );
}
