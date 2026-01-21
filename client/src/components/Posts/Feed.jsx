import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import ImagePreview from "./ImagePreview";
import Post from "./Post";
import { api } from "../../../utils/api.js";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Modal from "../Modal.jsx";
import Form from "../Form.jsx";

function Feed({ showAddModal, handleClose, handleFormSubmit }) {
  console.log("showAddModal:", showAddModal);
  // const [posts, setPosts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);   
  const [allData, setAllData] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    user: "",
    text: "",
    img_path: null,
  });
  // Modal state is managed in App.jsx and passed via props
  const navigate = useNavigate();
  const { user, loading, accessToken } = useAuth();

  //delete post on the UI NOT in terms of the backend of your database. Thats done in server.js file (backend)
  const handleDeleteInParent = (deleteId) => {
    setAllData(prev => prev.filter(post => post.id !== deleteId));
  }

  //edit post
  // You're getting the object sent from Post.jsx which is { id, user, title, img_pth, text}
  // so if you're trying to access the id in Feed.jsx, you do post.id
  const handleEditInParent = (post) => {
  setEditingPost(post); //post.id gives the id of the post object, 
  // post.title gives the title and etc for the other object props
  setEditModalOpen(true);
};

  // Don't do anything until auth finishes bootstrapping
  if (loading) return null; // or a spinner

  // After loading, enforce auth
  if (!user) return <Navigate to="/?auth=login" replace />;

  // Remove local modal handlers

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/getData");
        setAllData(response.data);
        // setLoading(false); // removed, loading comes from useAuth
      } catch (err) {
        throw err;
      }
    };
    {
      /* Add Modal for <Form /> triggered by Add button in Header */
    }
    fetchData();
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  console.log("Feed.jsx allData:", allData); // See if allData updates after submit
  return (
    // You were instructed to move the modal from App.jsx to Feed.jsx because it was being used in
    // two places. Now, you are using just modal in Feed.jsx but there is a issue happening where
    // the modal in Feed.jsx  wont close after you click submit on the form. It still adds the post
    // to the database though after you refresh the page manually. So that's where you left off.
    // You need to fix that and also the layout of the posts because since you moved the Modal in
    // Feed.jsx from the useEffect to the return JSX area, the layout has been wonky.
    <div className="w-full p-[1rem]">

      {/* Modal for adding new posts */}
      <Modal open={showAddModal} onClose={handleClose}>
        <Form 
          updatePosts={setAllData} 
          onClose={handleClose} 
          currentUser={user.username}
        />
      </Modal>


      {/* Modal for editing posts */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        {editingPost && (
          <>
          {console.log("Feed user:")}
          <Form 
            post={editingPost}
            currentUser={user.username}
            updatePosts={setAllData}
            onClose={() => setEditModalOpen(false)}
            isEdit={true}
          />
          </>
        )}
      </Modal>
      
      <div id="modalBackdrop">
        <div id="modalContent" className="grid grid-cols-3 gap-3">
          {/* this is what makes this page look like tumblr layout or more appropriately, masonry layout */}

          {/* this was previously in className for the above div: 
      flex flex-col mt-[60px] items-center justify-center */}

          {/* I got rid of the flash for when the default form was showing by allowing loading state to determine whether there is data already then show the posts. Whenever the user refreshes the page, the default form wont show unless there is no posts inputted. If there is then it would show the form to input data. */}
          {loading ? (

            
            <div>{loading}</div>
          ) : allData.length > 0 ? (
            allData.map((item, index) => (
              <Post
                key={index}
                id={item.id}
                handleDeleteInParent={handleDeleteInParent}
                handleEditInParent={handleEditInParent}
                title={item.title}
                user={item.usernames}
                image_path={item.image_path}
                data={allData}
                text={item.text}
                currentUser={user} //current logged-in user
              />
            ))
          ) : (
            <div>No posts yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
