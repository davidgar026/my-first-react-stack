import React from "react";
import ImagePreview from "./ImagePreview";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

function Post(props) {
  return (
    <div 
      className="w-full border-5 gap-4 flex flex-row justify-center "
      style={{ visibility: props.data.length > 0 ? "visible" : "hidden" }}>

      

        {/* -------------------------> first column */}
        <div className="border-3 w-[40%]">
          <p className="">- {props.user}</p>
          {/* image element */}
          <img
              className="rounded-[2px] object-cover w-full h-auto mb-3 "
              id="image_preview"
              src={`http://localhost:4000/uploads/${props.img_pth}`}
              alt="User's inputted image"
            />
        </div>
        
          {/* -------------------------> second column */}
          <div className="w-[40%] border-3 border-red-500 grid grid-rows-[auto_2fr_auto]">
              <p className="border-2  ">{props.title}</p>
              <p className="border-3  h-full overflow-auto">{props.text}</p>
              {/* You were working here. You were trying to allow the user to input any text whether short or long without effecting the image's size. You also decided to put the edit and delete button below the outside of the image to the right.That way, whatver text the user inputs on the right side can be shown because you decided not to use a scroll feature. */}

              <div className="h-full border-3  flex flex-col flex-wrap content-center">
                <EditButton />
                <DeleteButton />
              </div>
            </div>
      

    </div>
  );
}

export default Post;
