import React, { useState, useEffect } from "react";
import Login from "../Login";
import Signup from "../Signup";
import Modal from "../Modal";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../../contexts/AuthContext";

function LandingPage({ handleClick, showModal, divID, loading, user }) {
  const navigate = useNavigate();
  const location = useLocation();


  // Redirect signed-in users to /feed
  useEffect(() => {
    if (!loading && user) {
      navigate("/feed", { replace: true });
    }
  }, [loading, user, navigate]);

  // useEffect(() => {
  //   if (loading) return; // wait for auth bootstrap
  //   // Do not redirect automatically
  //   // if (user) navigate("/feed", { replace: true });
  //   // if there's no user, do nothing (stay on Landing)
  // }, [loading]);

  // Open login modal if ?auth=login is present and user is not signed in
  useEffect(() => {
    if (!loading && !user) {
      const params = new URLSearchParams(location.search);
      if (params.get("auth") === "login") {
        handleClick("div 1");
        params.delete("auth");
        navigate({ search: params.toString() }, { replace: true }); /*this line of code clears the auth in the URL
        so that it can close the log in or signup modal. Without these two lines of code then the modal will
        keep appearing even after clicking outside the modal */
      }
      if (params.get("auth") === "signup") {
        handleClick("div 2");
        params.delete("auth");
        navigate({ search: params.toString() }, { replace: true });
      }
    }
  }, [location.search, loading, user, handleClick]);

  

  return (
    <div className="">
      <div className="flex justify-center items-center h-full">
        <div className="w-[40%] shadow-xl rounded-md p-15">
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

          
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
