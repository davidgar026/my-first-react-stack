import React from "react";
import ImagePreview from "./ImagePreview";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

function Post(props) {
  return (
    <div 
      className=" inline-block w-full mb-[1rem] rounded-sm overflow-hidden break-inside-avoid shadow-[0_35px_35px_rgba(0,0,0,0.1)] justify-center"
      style={{ visibility: props.data.length > 0 ? "visible" : "hidden" }}>

        {/* ---------------------------------------------------------------> first column */}
        <div className=" w-full flex flex-col">
          <p className="">- {props.user}</p>
          {/* image element */}
          <img
              className="rounded-[2px]  object-cover"
              id="image_preview"
              src={`http://localhost:4000/uploads/${props.img_pth}`}
              alt="User's inputted image"
            />
            <div className=" grid grid-cols-2 justify-end ">
                <EditButton />
                <DeleteButton />
              </div>
        </div>
        
          {/* --------------------------------------------------------------->  second column */}
          <div className="flex flex-col w-full text-end p-5">
              <p className=" flex justify-center mb-5 ">{props.title}</p>
              <p className=" flex justify-center">{props.text}</p>
              {/*
              you were trying to have your 2nd column go below the 1st column whenever the 2nd column that contains the text gets too small. If its too small it can just go below the 1st column which contains the user's img input. So what fixed it is sm:w-[60%] because
              
              */}
            </div>
      

    </div>
  );
}

export default Post;
