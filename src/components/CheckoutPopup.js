import React, { useState } from "react";
import { X } from 'lucide-react';

const CheckoutPopup = ({ isOpen, onClose, darkMode, cartItems, currentUser }) => {
  // Shipping details ke liye state
  const [shippingDetails, setShippingDetails] = useState({
    name: currentUser ? currentUser.name : "", // Agar user logged in hai to naam pehle se bhar dein
    email: currentUser ? currentUser.email : "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  // Form mein type karne par state update karein
  const handleChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Order place karne ka function
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // YAHAN HUM STEP 3 MEIN API CALL KARENGE
    
    console.log("Order Placed:", shippingDetails, cartItems);
    alert("Order Placed Successfully! (Demo)"); // Abhi ke liye ek alert dikhayein
    onClose(); // Popup band karein
  };

  // Total price calculate karein
  const totalPrice = cartItems.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace(/[$,Rs]/g, '').replace(/,/g, ''));
    return total + (priceNumber * item.quantity);
  }, 0);

  const labelClass = `block mb-2 text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`;
  const inputClass = `w-full mb-3 border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Complete Your Order</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Form aur Summary) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Shipping Details Form */}
          <form onSubmit={handlePlaceOrder} className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
            
            <label className={labelClass}>Full Name</label>
            <input
              className={inputClass}
              type="text"
              name="name"
              value={shippingDetails.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            
            <label className={labelClass}>Email Address</label>
            <input
              className={inputClass}
              type="email"
              name="email"
              value={shippingDetails.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            
            <label className={labelClass}>Phone Number</label>
            <input
              className={inputClass}
              type="tel"
              name="phone"
              value={shippingDetails.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
            
            <label className={labelClass}>Shipping Address</label>
            <textarea
              className={inputClass}
              name="address"
              rows="3"
              value={shippingDetails.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              required
            ></textarea>

            {/* Payment Method (Simple) */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Payment Method</h3>
            <div className={`p-4 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
              <label className="flex items-center">
                <input type="radio" name="payment" className="form-radio text-green-600" defaultChecked />
                <span className="ml-2">Cash on Delivery (COD)</span>
              </label>
            </div>
            
            {/* Form submit button (neeche chala gaya) */}
          </form>

          {/* 2. Order Summary */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Your Order</h3>
            <div className="flex-1 space-y-3 overflow-y-auto border rounded-md p-4">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.name}`} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold text-xl">
                <span>Total Price:</span>
                <span className="text-green-700">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer (Place Order Button) */}
        <div className="p-4 border-t">
          <button
            type="submit"
            onClick={handlePlaceOrder} // Form ke bahar bhi click kaam karega
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-3 font-bold text-lg"
          >
            Place Order (COD)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;