import React from "react";
import axios from "axios";


function DeleteButton({ postId, onDelete }){
    const handleDelete = async () => {
        try{
            await axios.delete(`/api/posts/${postId}`);
            if(onDelete) onDelete(postId);

        }catch( error ){
            console.error("Failed to delete post: ", error)
        }
    }
 return <button className="" onClick={ handleDelete }>Delete</button>
}

export default DeleteButton