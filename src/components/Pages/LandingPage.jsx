import React, { useState, useEffect } from "react";
import Login from "../Login";
import Signup from "../Signup";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api.js";
import { useAuth } from "../../../contexts/AuthContext";

function LandingPage() {
  const [userCredentials, setUserCredentials] = useState(null);
  const [divID, setDivID] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login, signup, user } = useAuth(); // <-- use context

  useEffect(() => {
  if (user) navigate("/feed", { replace: true });
}, [user, navigate]);

  

  const handleClose = () => {
    setShowModal(false);
    setDivID(null);
  };

  const handleClick = async (name) => {
  // if already signed in, sign out first so we don't auto-redirect
  if (user) {
    await logout();            // clears cookie + context
  }
  setShowModal(true);
  setDivID(name); // 'div 1' for login, 'div 2' for signup
};

  // const handleFormSubmit = async (credentials) => {
    
  //   try {
  //     //decide which modal is currently open
  //     const mode = divID === "div 1" ? "login" : "signup";
  //     const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
  //     const { data } = await api.post(endpoint, credentials, {
  //       withCredentials: true,
  //     });

  //     setUserCredentials(credentials);
  //     setShowModal(false);
  //     setDivID(null);

  //     navigate("/feed");
  //   } catch (err) {
  //     console.error("[ AUTH ERR ]", {
  //       status: err.response?.status,
  //       data: err.response?.data,
  //     });
  //     alert(
  //       err.response?.data?.error ||
  //         err.response?.data?.message ||
  //         "Authentication failed."
  //     );
  //   }
  // };

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
      console.error("[ AUTH ERR ]", {
        status: err.response?.status,
        data: err.response?.data,
      });
      alert(err.response?.data?.error || "Authentication failed.");
    }
  };

  return (
    <div className=" ">
      {/* border-red-500 border-8 */}
      <div id="modalBackdrop" className="flex justify-center items-center  h-full ">
        <div id="modalContent" className="h-max w-[40%] shadow-xl rounded-md p-15">
          <h1>
            Hi! I’m David, a self‑taught web developer from New York. I built
            this platform so anyone can share whatever’s on their mind, moments
            you’ve experienced, places you’ve visited, thoughts you want to
            express, and so much more. This is my re‑imagining of the classic
            Tumblr spirit, but built for today where modern technology and AI
            work together to help you express yourself more than ever before. If
            you ever need a little creative spark, the built‑in AI can help
            shape your posts, refine your words, or even inspire new ideas. This
            is your corner of the internet make it yours.
          </h1>
          <div className="flex flex-col justify-center ">
            <button
              className="mb-5"
              onClick={() => {
                handleClick("div 1");
              }}
            >
              Log in
            </button>
            <p className="flex justify-center mb-5">or</p>
            <button
              onClick={() => {
                handleClick("div 2");
              }}
            >
              Sign Up
            </button>
          </div>

          {showModal && (
            <div
              onClick={handleClose}
              className="fixed inset-0 flex items-center justify-center bg-zinc-500/95"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col h-[65%] w-[25%] bg-[#F9F6F3] p-6 rounded shadow-lg"
              >
                {divID == "div 1" ? (
                  <Login onFormSubmit={handleFormSubmit} />
                ) : (
                  <Signup onFormSubmit={handleFormSubmit} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
