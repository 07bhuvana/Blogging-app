import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import Home from "./pages/Home.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Login from "./login/Login.jsx";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuth(!!currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Router>
        <header className="navbar">
          <Link to="/" className="navbar-brand">Blogging</Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            {!isAuth ? (
              <Link to="/login" className="btn btn-primary">Login</Link>
            ) : (
              <>
                <Link to="/createpost" className="nav-link">Create Post</Link>
                <button className="btn btn-danger" onClick={signUserOut}>Log Out</button>
              </>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home isAuth={isAuth} />} />
            <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
            <Route path="/createpost" element={isAuth ? <CreatePost isAuth={isAuth} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
