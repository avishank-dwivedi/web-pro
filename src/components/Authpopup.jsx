import React, { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

const AuthPopup = ({ isOpen, onClose, darkMode, onLoginSuccess, onForgotPasswordClick }) => {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLoginChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = e => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleTabClick = (nextTab) => {
    setTab(nextTab);
    setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed. Please try again.");
      } else {
        onLoginSuccess(data); 
        onClose();
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Failed to connect to the server. Please check your connection.");
    }
  };
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Signup failed. Please try again.");
      } else {
        onLoginSuccess(data); 
        onClose();
      }
    } catch (err) {
      console.error("Signup fetch error:", err);
      setError("Failed to connect to the server. Please check your connection.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className={`relative p-6 rounded-lg shadow-lg w-80 mx-4 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`absolute top-2 right-4 text-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
          onClick={onClose}
          aria-label="Close popup"
        >×</button>
        
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => handleTabClick("login")}
            className={`px-4 py-1 rounded-t ${tab === "login" ? "bg-green-600 font-bold text-white" : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}
          >Login</button>
          <button
            type="button"
            onClick={() => handleTabClick("signup")}
            className={`px-4 py-1 rounded-t ${tab === "signup" ? "bg-green-600 font-bold text-white" : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}
          >Signup</button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-xs" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit} autoComplete="off">
            <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Email</label>
            <input
              className={`w-full mb-3 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              type="email"
              placeholder="Enter Email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              autoComplete="username"
              required
            />
            <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Password</label>
            <input
              className={`w-full mb-4 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              type="password"
              placeholder="Enter Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-bold mb-2"
            >Sign In</button>
            <div className="text-right text-xs mt-2">
              <button
                type="button"
                onClick={onForgotPasswordClick} 
                className={`${darkMode ? 'text-green-300 hover:underline' : 'text-green-700 hover:underline'}`}
              >Forgot password?</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} autoComplete="off">
            <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Name</label>
            <input
              className={`w-full mb-3 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              type="text"
              placeholder="Enter Name"
              name="name"
              value={signupData.name}
              onChange={handleSignupChange}
              autoComplete="name"
              required
            />
            <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Email</label>
            <input
              className={`w-full mb-3 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              type="email"
              placeholder="Enter Email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              autoComplete="username"
              required
            />
            <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Password</label>
            <input
              className={`w-full mb-4 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              type="password"
              placeholder="Enter Password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              autoComplete="new-password"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-bold"
            >Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;