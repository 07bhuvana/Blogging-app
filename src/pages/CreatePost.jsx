import React, { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import "./CreatePost.css";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const postsCollectionRef = collection(db, "posts");
  const navigate = useNavigate();
  
  // Check auth
  React.useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  // Handle file selection
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    const validVideoTypes = ["video/mp4", "video/quicktime"];

    let newMediaFiles = [];
    let newPreviews = [];

    for (const file of files) {
      if (validImageTypes.includes(file.type)) {
        try {
          const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          newMediaFiles.push(compressedFile);
          newPreviews.push({ type: "image", url: URL.createObjectURL(compressedFile) });
        } catch (error) {
          console.error("Image Compression Error:", error);
        }
      } else if (validVideoTypes.includes(file.type)) {
        newMediaFiles.push(file);
        newPreviews.push({ type: "video", url: URL.createObjectURL(file) });
      } else {
        alert("Invalid file type! Upload JPG, PNG, MP4, or MOV.");
      }
    }

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
    setPreviews([...previews, ...newPreviews]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove media item
  const removeMedia = (index) => {
    const newMediaFiles = [...mediaFiles];
    const newPreviews = [...previews];
    
    // Revoke object URL to avoid memory leaks
    if (newPreviews[index]?.url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }
    
    newMediaFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newMediaFiles);
    setPreviews(newPreviews);
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/deldsgngj/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject("Upload failed");
        }
      };

      xhr.onerror = () => reject("Network error");
      xhr.send(formData);
    });
  };

  // Create post
  const createPost = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    if (!content.trim() && !mediaFiles.length) {
      alert("Post must contain at least content or media!");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    let mediaUrls = [];

    try {
      // If there are media files to upload
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          const url = await uploadToCloudinary(file);
          if (!url) {
            throw new Error("Media upload failed");
          }
          mediaUrls.push(url);
          
          // Update progress based on files uploaded
          const progressPercent = Math.round(((i + 1) / mediaFiles.length) * 100);
          setUploadProgress(progressPercent);
        }
      }

      // Create the post document
      await addDoc(postsCollectionRef, {
        title,
        content,
        media: mediaUrls,
        author: {
          name: auth.currentUser?.displayName || "Anonymous",
          id: auth.currentUser?.uid || "guest",
        },
        likes: 0,
        comments: [],
        createdAt: new Date(),
      });

      // Clean up preview URLs
      previews.forEach(preview => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });

      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-box">
        <div className="create-post-header">
          <h1 className="create-post-title">Create New Post</h1>
          <p className="create-post-subtitle">Share your thoughts with the world</p>
        </div>

        <div className="input-group">
          <label className="input-label">Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter a compelling title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Content</label>
          <textarea
            className="input-field textarea-field"
            placeholder="Write your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Media</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <svg xmlns="http://www.w3.org/2000/svg" className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span className="file-text">
                Drop files here or click to upload<br />
                <span style={{opacity: 0.7}}>(Images and videos)</span>
              </span>
              <input
                type="file"
                accept="image/*, video/*"
                multiple
                onChange={handleFileChange}
                className="file-input"
                ref={fileInputRef}
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="media-previews">
            {previews.map((file, index) => (
              <div key={index} className="media-preview-item">
                {file.type === "image" ? (
                  <img src={file.url} alt="Preview" className="preview-image" />
                ) : (
                  <video src={file.url} controls className="preview-video" />
                )}
                <button
                  className="remove-media"
                  onClick={() => removeMedia(index)}
                  disabled={loading}
                  aria-label="Remove media"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadProgress > 0 && loading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="progress-text">Uploading: {uploadProgress}%</p>
          </div>
        )}

        <button 
          className="submit-button" 
          onClick={createPost} 
          disabled={loading}
        >
          {loading ? "Creating Post..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
