import React from "react";
import axios from "axios";

function EditButton({ postId, updateData, onEdit }) {

  return (
    <button className="" onClick={onEdit}>
      Edit
    </button>
  );
}

export default EditButton;
