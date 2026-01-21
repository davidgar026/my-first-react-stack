import React from "react";
import ImagePreview from "./ImagePreview";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";


const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || "http://localhost:4000";

function Post({ id, handleDeleteInParent, user, title, image_path, text, data, currentUser, handleEditInParent }) {

  console.log("username = ", currentUser.username)
  const isOwner = currentUser && user === currentUser.username;

  

  return (
    <div 
      className="  h-full mb-[1rem] rounded-sm overflow-hidden break-inside-avoid shadow-[0_35px_35px_rgba(0,0,0,0.1)] justify-center"
      style={{ visibility: data.length > 0 ? "visible" : "hidden" }}>
        
        {/* ---------------------------------------------------------------> first column */}
        <div className=" w-[250px] flex w-full flex-col">
          <p className="">- {user}</p>
          {/* image element */}
          <img
              className="rounded-[2px]  object-cover"
              id="image_preview"
              src={`${apiBase}/uploads/${image_path}`}
              alt="User's inputted image"
            />
            <div className=" grid grid-cols-2 justify-end ">
                {isOwner && <EditButton postId={id} onEdit={() => handleEditInParent({ id, user, title, image_path, text})}/>}
                {isOwner && <DeleteButton postId={id} onDelete={handleDeleteInParent}/>}
              </div>
        </div>
        
          {/* --------------------------------------------------------------->  second column */}
          <div className="flex flex-col w-full text-end p-5">
              <p className=" flex justify-center mb-5 ">{title}</p>
              <p className=" flex justify-center">{text}</p>
              {/*
              you were trying to have your 2nd column go below the 1st column whenever the 2nd column that contains the text gets too small. If its too small it can just go below the 1st column which contains the user's img input. So what fixed it is sm:w-[60%] because
              */}
            </div>
      

    </div>
  );
}

export default Post;
