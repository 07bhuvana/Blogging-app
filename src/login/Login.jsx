import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import custom styles

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="title">🚀 Welcome to Blogging!</h1>
        <p className="subtitle">
          "Write your thoughts. Inspire the world. Start your journey today!"
        </p>

        {/* Google Sign-In Button */}
        <button onClick={signInWithGoogle} className="google-btn">
             <img src="/images/google.png" alt="Google Logo" className="google-icon" />
                 Sign in with Google
        </button>


        <p className="quote">
          ✨ "Every great story begins with a single word. Let yours start here!" ✨
        </p>

        <p className="terms">
          By signing in, you agree to our{" "}
          <a href="/terms" className="link">Terms</a> and{" "}
          <a href="/privacy" className="link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
