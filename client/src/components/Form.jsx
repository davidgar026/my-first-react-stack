import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ImagePreview from "./Posts/ImagePreview";
import Post from "./Posts/Post";

function Form({ onClose, currentUser, updatePosts, post, isEdit }) {

  console.log("currentUser prop in Form:", currentUser);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiIdea, setAiIdea] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    user: currentUser || "",
    text: post?.text || "",
    image_path: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
  if (currentUser) {
    setFormData((prev) => ({
      ...prev,
      user: currentUser,
    }));
  }
}, [currentUser]);

  useEffect(() => {
    if(isEdit && post && post.image_path){
      setSelectedImage(`http://localhost:4000/uploads/${post.image_path}`);
      setFormData({
        title: post.title || "",
        user: post.user || "",
        text: post.text || "",
        image_path: post.image_path || null,
      });
      setSelectedImage(post.image_path ? `http://localhost:4000/uploads/${post.image_path}` : null);
    }
  }, [isEdit, post])

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    uploadData.append("text", formData.text);
    uploadData.append("user", formData.user);

    if(isEdit && post && !file && post.img_pth){
      uploadData.append("image_path", post.image_path)
    }
    if (file) {uploadData.append("file", file); // assuming you saved it in useState
      }else{
        //If editing and no new file chosen, send existing image_path so backend keeps it.
        uploadData.append("image_path", formData.image_path || post.image_path || "");
      }

    try {
      let res;
      console.log("isEdit = ", isEdit)
      console.log("post = ", post)
      if(isEdit && post){
        //updates existing post
        res = await axios.patch(`/api/posts/${post.id}`, uploadData);
      }else{
        //creates new post
        res = await axios.post(`/api/submit`, uploadData);
      }

      // refresh posts via parent callback (preferred) and close modal
      if (updatePosts) {
        const postsRes = await axios.get("/api/getData");
        updatePosts(postsRes.data);
      }

      if( onClose ) onClose();
      //window.location.reload();
      //navigate("/feed");
    } catch (error) {
      console.log("Unable to send data due to error: ", error);
    }
  };

  const handleGenerateAI = async () => {
    try{
      setAiLoading(true);
      setAiError("");

      const res = await axios.post("http://localhost:4000/api/ai/generate-post",{
        prompt: aiIdea,
        tone: "tumblr",
        maxWords: 100,
      });

      setFormData((prev) => ({
        ...prev,
        title: res.data.title ?? prev.title,
        text: res.data.description ?? prev.text,
      }))

      //Close AI prompt after filling the form from AI
      setShowAiPrompt(false);
      setAiIdea("");

    }catch(err){
      console.log("AI generate error: ", err);
      setAiError("Failed to generate. Try again.")
    }finally{
      setAiLoading(false);
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
                value={formData.title}
              />

                {/* YOU WERE WORKING HERE vvvv TRYING TO MAKE THE DEFAULT VALUE TO THE USERNAME ALREADY SIGNED IN */}
              <input
                name="user"
                className="text-black w-full bg-[#697565] p-3 rounded-md"
                type="text"
                value={formData.user}
                hidden
              />
            </div>

            {/* <img src={selectedImage}/> */}

            <div className="mb-2 w-full h-full">
              <textarea
                name="text"
                className="text-black max-h-80 w-full mb-1 bg-[#697565]  p-5 rounded-md"
                placeholder="Post description..."
                onChange={handleChange}
                value={formData.text}
              ></textarea>

              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={() => setShowAiPrompt((prev) => !prev)}
                  className="w-40 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer shadow-xs bg-[#ECDFCC] text-black"
                >
                  {showAiPrompt ? "Close AI" : "Generate with AI"}
                </button>

                {showAiPrompt && (
                  <div className="mt-3 mb-3 p-3 rounded-md bg-[#697565] text-black w-full">
                    <label className="block mb-2">What should the post be about?</label>

                    <textarea
                      value={aiIdea}
                      onChange={(e) => setAiIdea(e.target.value)}
                      placeholder="Example: A rainy NYC day, coffee shop vibes, journaling..."
                      className="text-black w-full bg-[#ECDFCC] p-3 rounded-md"
                      rows={3}
                    />

                    <div className="flex gap-2 mt-2">
                      <button 
                        type="button"
                        disabled={aiLoading || !aiIdea.trim()}
                        onClick={handleGenerateAI}
                        className="pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer shadow-xs bg-[#ECDFCC] text-black"
                      >
                        {aiLoading ? "Generating..." : "Generate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAiIdea("");
                          setAiError("");
                          setShowAiPrompt(false);
                          className="pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer shadow-xs bg-[#ECDFCC] text-black"
                        }}
                      >
                        Cancel  
                      </button>
                    </div>

                      {aiError && <p className="mt-2 text-red-200">{aiError}</p>}
                  </div>
                )}


                
               <button
  className="w-25 pl-4 pr-4 pt-1 pb-1 rounded-[55px] cursor-pointer hover:bg-sky-700 shadow-xs bg-[#ECDFCC] text-black"
  type="submit"
>
  {isEdit ? "Update" : "Submit"}
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
                  name="image_path"
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
