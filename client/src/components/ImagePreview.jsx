import React from "react";

function ImagePreview(props){

    return(
        <img
            className="border-5 w-100 mb-3"
            id="image_preview"
            src={props.passImage}
            alt="User's inputted image"
            hidden={props.hideOrNah}
        />
    )
}

export default ImagePreview;