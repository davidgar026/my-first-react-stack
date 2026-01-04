import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Modal from "../Modal";
// Rather than using <a> tag,
// 	•	<Link> is a special component from react-router-dom that updates the URL without reloading.
// 	•	It tells React Router, “Change the route to this path and show the matching component.”
// 	•	This makes your navigation faster and keeps state (like your logged-in user) intact.

function possessive(name = "") {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export default function Header({ handleClick, onAddClick, onCloseModal}) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="grid w-full col-span-2 grid-cols-2 grid-rows-1 p-4 ">
      <div className="text-xl font-semibold">PShare</div>
      <div>
        {loading ? (
          <div className="h-5 w-40 bg-zinc-200 rounded animate-pulse" />
        ) : user ? (
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-zinc-700">
              {possessive(user.username)} account
            </span>
            {/* <Link to="/add" className="text-sm font-medium hover:underline">
              Add
            </Link> */}
            <button 
              onClick={() => handleClick("div 3")} 
              className="text-sm font-medium hover:underline">
                Add
            </button>
            
            <Link to="/feed" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate("/", { replace: true });
              }}
              className="rounded px-3 py-1 bg-zinc-900 text-white"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex gap-3 justify-end">
            <Link
              to="/?auth=signup"
              className=" rounded px-3 py-1 bg-zinc-900 text-white "
              onClick={() => setHideForm(true)}
            >
              Sign Up
            </Link>
            <Link
              to="/?auth=login"
              className=" rounded px-3 py-1 bg-zinc-900 text-white "
              onClick={() => setHideForm(true)}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
