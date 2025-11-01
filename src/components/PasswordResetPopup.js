import React, { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

const PasswordResetPopup = ({ isOpen, onClose, darkMode }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Token/Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [message, setMessage] = useState({ text: "", isError: false });

  if (!isOpen) return null;

  // Step 1: Reset token request karein
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage({ text: "Sending...", isError: false });

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.detail || "Failed to send email.", isError: true });
      } else {
        setMessage({ text: data.message, isError: false }); 
        setStep(2); // Agle step par jaayein
      }
    } catch (err) {
      console.error("Reset request error:", err);
      setMessage({ text: "Failed to connect to server.", isError: true });
    }
  };

  // Step 2: Password update karein
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: "Updating...", isError: false });

    try {
      const response = await fetch(`${API_BASE_URL}/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token: token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.detail || "Failed to update password.", isError: true });
      } else {
        setMessage({ text: data.message, isError: false });
        setTimeout(() => {
          handleClose(); // 3 second baad popup band karein
        }, 3000);
      }
    } catch (err) {
      console.error("Update password error:", err);
      setMessage({ text: "Failed to connect to server.", isError: true });
    }
  };
  
  const handleClose = () => {
    // Band karte samay sab reset karein
    setStep(1);
    setEmail("");
    setToken("");
    setNewPassword("");
    setMessage({text: "", isError: false});
    onClose();
  }

  const labelClass = `block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`;
  const inputClass = `w-full mb-3 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={handleClose}>
      <div
        className={`relative p-6 rounded-lg shadow-lg w-80 mx-4 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`absolute top-2 right-4 text-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
          onClick={handleClose}
          aria-label="Close popup"
        >×</button>
        
        <h3 className="text-xl font-bold text-center mb-4">
          {step === 1 ? "Reset Password" : "Check Your Email"}
        </h3>
        
        {/* Message Area */}
        {message.text && (
          <div className={`${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} p-3 rounded mb-4 text-xs`} role="alert">
            {message.text}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Apna email daalein. Hum aapko ek 6-digit code bhejenge.
            </p>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-bold"
            >Send Code</button>
          </form>
        )}
        
        {/* Step 2: Token & New Password Form */}
        {step === 2 && (
          <form onSubmit={handleUpdatePassword}>
            <label className={labelClass}>Email (locked)</label>
            <input
              className={`${inputClass} bg-gray-200 text-gray-500`}
              type="email"
              value={email}
              readOnly
            />
            
            <label className={labelClass}>6-Digit Code</label>
            <input
              className={inputClass}
              type="text"
              placeholder="Aapke email se code daalein"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
            />
            
            <label className={labelClass}>New Password</label>
            <input
              className={inputClass}
              type="password"
              placeholder="Naya password daalein"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-bold"
            >Update Password</button>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default PasswordResetPopup;