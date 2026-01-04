import React, { useState, useEffect } from "react";

export default function Login({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit?.(formData);
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      <h1 className="mb-5">Log In:</h1>
      <div className="mb-4">
        <label htmlFor="username">Username:</label>
      <input
        className="text-black w-full bg-[#697565] p-3 rounded-md"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        required
      />
      </div>
      
    <div>
        <label htmlFor="password">Password:</label>
      <input
        className="text-black w-full bg-[#697565] p-3 rounded-md"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </div>
      

      <div>
        <button
          className=" w-25 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer hover:bg-sky-700 shadow-xs bg-[#ECDFCC] text-black mt-8"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
