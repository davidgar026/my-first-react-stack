import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";

function Content() {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title:"",
  })

  const handleChange = (e) => {
    console.log("e.target.name = ", e.target.name)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

     console.log("formData: ", formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


    axios
      .get("http://localhost:4000/api/submit")
      .then((response) => setMessage(response.data.formData))
      .catch((error) => console.error("Error fetching message: ", error));


    // try{
    //   const response = await axios.post('/api/submit', formData);
    //   console.log("Response data sent succesfully!", response.data)
    // }catch(error){
    //   console.log("Unable to send data due to error: ", error)
    // }
  };



  useEffect(() => {
    axios
      .get("http://localhost:4000/api/message")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Error fetching message: ", error));
  });

  function handleFileInput(e) {
    const file = e.target.files[0];

    if (!file) {
      console.log("No file selected. Please choose a file.", "error");
      return;
    } else {
      console.log("file selected");
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    console.log("file = ", file);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      { <p className="">{message}</p> }
      <form onSubmit={handleSubmit} className="flex items-center gap-[20px]">
        <div className=" ">
          <div className="flex justify-between gap-[8px] mb-2 w-full ">
            <input
              className="text-black w-full bg-[#697565] p-3 rounded-md"
              type="text"
              placeholder="Post Title"
              onChange={handleChange}
            />
            <input
              className="text-black w-full bg-[#697565] p-3 rounded-md"
              type="text"
              placeholder="Username"
            />
          </div>

    
          {/* <img src={selectedImage}/> */}
         
          <div className="mb-2 w-full h-full">
            <textarea
              className="text-black max-h-80 w-full mb-1 bg-[#697565]  p-5 rounded-md"
              placeholder="Post description..."
            ></textarea>

            <div className="flex justify-end">
            
            <button
              className=" w-25 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer hover:bg-sky-700 shadow-xs bg-[#ECDFCC] text-black "
              type="submit"
            >
              Submit
            </button>
          </div>
          </div>
          
        </div>
         {/* -------------------------------- */}
        <div className="h-full flex flex-col justify-center">
          {selectedImage ? null : 
          <label
            htmlFor="inputFile"
            className=" cursor-pointer bg-white bg-[#ECDFCC] rounded-[20px] p-3"
          >
            Insert Image
            <input
              id="inputFile"
              type="file"
              onChange={handleFileInput}
              hidden
            />
          </label>}

          {/* <img src={selectedImage}/> */}
          <div>
            {selectedImage ? (
              <ImagePreview 
              passImage={selectedImage}
              />
            ) : (
              <ImagePreview  
                className="border"
                hideOrNah={true}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Content;
