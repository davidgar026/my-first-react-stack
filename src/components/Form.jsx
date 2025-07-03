import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ImagePreview from "./ImagePreview";
import Post from "./Post";

function Form() {
//   const [allData, setAllData] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    user: "",
    text: "",
    img_path: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/getData");
//         setAllData(response.data);
//         setLoading(false);
//       } catch (err) {
//         throw err;
//       }
//     };

//     fetchData();
//   }, []);

  async function handleFileInput(e) {
    const fileInput = e.target.files[0]; //capture user's file input
    console.log("fileInput = ", fileInput);
    setFile(fileInput);

    //file input validation check
    if (!fileInput) {
      console.log("No file selected. Please choose a file.", "error");
      return;
    } else {
      console.log("file selected");
    }

    //temporarily read the contents of the user's file input
    const reader = new FileReader();

    //console.log("file = ", file);
    reader.readAsDataURL(fileInput); //read file as a URL

    reader.onload = () => {
      setSelectedImage(reader.result); // allows us to use state to preview user's file input brieflyt
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // this prevents the page from loading after user submits. I took this out so that I can intentionally have the page refresh.

    const uploadData = new FormData();

    uploadData.append("title", formData.title);
    uploadData.append("description", formData.text);
    uploadData.append("user", formData.user);
    uploadData.append("file", file); // assuming you saved it in useState
    console.log("uploadData = ", uploadData);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/submit",
        uploadData
      );
      console.log("data has been submitted: ", res.data);
        //window.location.reload();
        navigate("/");

      // console.log("Response data sent succesfully!", response.data)
    } catch (error) {
      console.log("Unable to send data due to error: ", error);
    }
  };

  return (

      // {/* I got rid of the flash for when the default form was showing by allowing loading state to determine whether there is data already then show the posts. Whenever the user refreshes the page, the default form wont show unless there is no posts inputted. If there is then it would show the form to input data. */}
      <div className="grid col-span-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-[20px] "
        //   style={{ visibility: allData.length == 0 ? "visible" : "hidden" }}
        >
          <div className="">
            <div className="flex justify-between gap-[8px] mb-2 w-full ">
              <input
                name="title"
                className="text-black w-full bg-[#697565] p-3 rounded-md"
                type="text"
                placeholder="Post Title"
                onChange={handleChange}
              />
              <input
                name="user"
                className="text-black w-full bg-[#697565] p-3 rounded-md"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </div>

            {/* <img src={selectedImage}/> */}

            <div className="mb-2 w-full h-full">
              <textarea
                name="text"
                className="text-black max-h-80 w-full mb-1 bg-[#697565]  p-5 rounded-md"
                placeholder="Post description..."
                onChange={handleChange}
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
            {selectedImage ? null : (
              <label
                htmlFor="inputFile"
                className=" cursor-pointer bg-white bg-[#ECDFCC] rounded-[20px] p-3"
              >
                Insert Image
                <input
                  name="img_path"
                  id="inputFile"
                  type="file"
                  onChange={handleFileInput}
                  hidden
                />
              </label>
            )}

            {/* <img src={selectedImage}/> */}
            <div>
              {selectedImage ? (
                <ImagePreview passImage={selectedImage} />
              ) : (
                <ImagePreview className="border" hideOrNah={true} />
              )}
            </div>
          </div>
        </form>
      </div>
  );
}

export default Form;
