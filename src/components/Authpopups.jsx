import React, { useState } from "react";

const AuthPopup = ({ open, onClose }) => {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-80 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setTab("login")}
            className={`px-4 py-1 rounded-t ${tab === "login" ? "bg-green-200 font-bold" : "bg-gray-100"}`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`px-4 py-1 rounded-t ${tab === "signup" ? "bg-green-200 font-bold" : "bg-gray-100"}`}
          >
            Signup
          </button>
        </div>
        {tab === "login" ? (
          <form>
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              className="w-full mb-3 border p-2 rounded"
              type="email"
              placeholder="Enter Email"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
            />
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              className="w-full mb-4 border p-2 rounded"
              type="password"
              placeholder="Enter Password"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded p-2 font-bold mb-2"
            >
              Sign In
            </button>
            <div className="text-right text-xs mt-2">
              <button
                type="button"
                onClick={() => alert("Forgot Password? (demo)")}
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form>
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <input
              className="w-full mb-3 border p-2 rounded"
              type="text"
              placeholder="Enter Name"
              value={signupData.name}
              onChange={e => setSignupData({ ...signupData, name: e.target.value })}
            />
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              className="w-full mb-3 border p-2 rounded"
              type="email"
              placeholder="Enter Email"
              value={signupData.email}
              onChange={e => setSignupData({ ...signupData, email: e.target.value })}
            />
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              className="w-full mb-4 border p-2 rounded"
              type="password"
              placeholder="Enter Password"
              value={signupData.password}
              onChange={e => setSignupData({ ...signupData, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded p-2 font-bold"
            >
              Sign Up
            </button>
          </form>
        )}
        <button
          className="absolute top-2 right-4 text-lg text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close popup"
        >×</button>
      </div>
    </div>
  );
};

export default AuthPopup;
