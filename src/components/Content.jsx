import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";

function Content() {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeImage, setActiveImage] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/message")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Error fetching message: ", error));
  });

  function imagePresent(){
    setActiveImage(!activeImage)
  }


  function handleChange(e){
    const file = e.target.files[0];

    if(!file){
      console.log("No file selected. Please choose a file.", "error");
      return;
    }else{
      console.log("file selected")
    }
    
      const reader = new FileReader();
      
      reader.onload = () => {
        setSelectedImage(reader.result)
        
      }
      console.log("file = ", file)
      reader.readAsDataURL(file)
      

  }

  return (
    <div className="flex flex-col items-center justify-center ">
      {/* <p className="">{message}</p> */}
      <form className="flex flex-col max-h-full items-center border-2 w-full">
        <div className="flex justify-between gap-[20px] mb-2 w-100 ">
          <input className="text-[#F3F3E0] w-full bg-[#27548A] p-3 rounded-md" type="text" placeholder="Post Title"/>
          <input 
            className="text-[#F3F3E0] w-full bg-[#27548A] p-3 rounded-md" 
            type="email" 
            placeholder="Username" 
            />
        </div>
        
          <label 
            htmlFor="inputFile" 
            className="border mb-4 mt-2  items-center p-3 gap-3 rounded-xl border bg-gray-50 cursor-pointer w-100">Something to post?
            <input 
              id="inputFile" 
              type="file" 
              className=" border rounded-md w-full mt-3 mb-5 text-[#F3F3E0] file:p-5 file:bg-[#27548A] file:mr-3 file:py-2 file:rounded-md hover:file:bg-gray-400 " 
              onChange={handleChange}
              hidden/>
          </label>
          {/* <img src={selectedImage}/> */}
          <div className="flex justify-center">
            {selectedImage ? <ImagePreview passImage={selectedImage} /> : <ImagePreview hideOrNah={true} />}
          </div>
          <div className="mb-2 w-100">
           <textarea className="text-[#F3F3E0] w-full mb-1 bg-[#27548A]  p-5 rounded-md" placeholder="Post description..."></textarea>
        </div>
       
        
        
        <div className="flex justify-end">
          <button
          className=" w-25 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer hover:bg-sky-700 shadow-xs bg-[#27548A] text-white border-black"
          type="submit"
        >
          Submit
        </button>
        </div>
        
      </form>
    </div>
  );
}

export default Content;
