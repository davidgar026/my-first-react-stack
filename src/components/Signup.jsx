import React, { useState } from "react";

export default function Signup({ onFormSubmit }){
    const [ formData, setFormData ] = useState({ username: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit?.(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [ name ]: value}))
    };

    return (
    <form className="" onSubmit={handleSubmit} >
        <h1 className="mb-5">Sign Up:</h1>
        <label>
            Username:
            <input 
                className="text-black w-full bg-[#697565] p-3 rounded-md"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
            />
        </label>
        
        <label>
            Password:
           <input 
                className="text-black w-full bg-[#697565] p-3 rounded-md"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            /> 
        </label>
        
        <button className=" w-25 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer hover:bg-sky-700 shadow-xs bg-[#ECDFCC] text-black mt-6" type="submit">Submit</button>
    </form>

)};