import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = ({ isAuth }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [menuVisible, setMenuVisible] = useState({});
  const [deleting, setDeleting] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
  }, [isAuth, navigate]); // <-- Make sure dependencies are correctly listed
  

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await getDocs(collection(db, "posts"));
        const sortedPosts = data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => {
            // Sort by createdAt in descending order (newest first)
            const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
          });
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const deleteCloudinaryMedia = async (mediaUrl) => {
    try {
      if (!mediaUrl) return;
      const publicId = mediaUrl.split("/").pop().split(".")[0];
      await axios.post(`yourcloudinary link`, {
        public_id: publicId,
      });
    } catch (error) {
      console.error("Error deleting media from Cloudinary:", error);
    }
  };

  const deletePost = async (id, mediaUrl) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      if (mediaUrl) {
        if (Array.isArray(mediaUrl)) {
          for (const url of mediaUrl) {
            await deleteCloudinaryMedia(url);
          }
        } else {
          await deleteCloudinaryMedia(mediaUrl);
        }
      }
      await deleteDoc(doc(db, "posts", id));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
      setMenuVisible((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleLike = async (id, currentLikes) => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { likes: currentLikes + 1 });
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (id) => {
    const commentText = commentInput[id]?.trim();
    if (!commentText) return;

    try {
      const postRef = doc(db, "posts", id);
      const newComment = { 
        text: commentText, 
        user: auth.currentUser.displayName || "Anonymous",
        timestamp: new Date()
      };
      await updateDoc(postRef, { comments: arrayUnion(newComment) });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, comments: [...(post.comments || []), newComment] } : post
        )
      );
      setCommentInput((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="feed-header">
        <h1 className="feed-title">Latest Posts</h1>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty-container">
          <p className="empty-text">No posts yet. Be the first to create a post!</p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <div className="post-author">
                  {post.author?.name || "Anonymous"}
                </div>
                {auth.currentUser?.uid === post.author?.id && (
                  <div className="options-menu">
                    <button
                      className="options-button"
                      onClick={() => setMenuVisible((prev) => ({ 
                        ...prev, 
                        [post.id]: !prev[post.id] 
                      }))}
                      aria-label="Post options"
                    >
                      ⋮
                    </button>
                    {menuVisible[post.id] && (
                      <div className="options-dropdown">
                        <button 
                          onClick={() => deletePost(post.id, post.media)}
                          disabled={deleting[post.id]}
                        >
                          {deleting[post.id] ? "Deleting..." : "Delete Post"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h2 className="post-title">{post.title}</h2>

              {Array.isArray(post.media) ? (
                post.media.map((mediaUrl, index) =>
                  mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img key={index} src={mediaUrl} alt="Post" className="post-image" />
                  ) : mediaUrl.match(/\.(mp4|mov)$/) ? (
                    <video key={index} src={mediaUrl} controls className="post-video"></video>
                  ) : null
                )
              ) : post.media ? (
                post.media.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img src={post.media} alt="Post" className="post-image" />
                ) : post.media.match(/\.(mp4|mov)$/) ? (
                  <video src={post.media} controls className="post-video"></video>
                ) : null
              ) : null}

              {post.content && <p className="post-text">{post.content}</p>}

              <div className="post-actions">
                <button className="like-btn" onClick={() => handleLike(post.id, post.likes)}>
                  {post.likes || 0}
                </button>
                <button
                  className="comment-btn"
                  onClick={() => setShowComments((prev) => ({ 
                    ...prev, 
                    [post.id]: !prev[post.id] 
                  }))}
                >
                  {post.comments?.length || 0}
                </button>
              </div>

              {showComments[post.id] && (
                <div className="comments-section">
                  {post.comments?.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <div className="comment-user">{comment.user}</div>
                        <div>{comment.text}</div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                  <div className="comment-form">
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Add a comment..."
                      value={commentInput[post.id] || ""}
                      onChange={(e) => setCommentInput((prev) => ({ 
                        ...prev, 
                        [post.id]: e.target.value 
                      }))}
                      onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                    />
                    <button 
                      className="comment-submit"
                      onClick={() => addComment(post.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
