import React from "react";
import ImagePreview from "./ImagePreview";


function Post(props) {
  return (
    
    <div 
      className=""
      style={{ visibility: props.data.length > 0 ? "visible" : "hidden" }}
      >
      <p>- {props.user}</p>
      <img
            className="border-5 w-100 mb-3"
            id="image_preview"
            src={`http://localhost:4000/uploads/${props.img_pth}`}
            alt="User's inputted image"
        />

        <p>{ props.text }</p>
    </div>
  );
}

export default Post;
