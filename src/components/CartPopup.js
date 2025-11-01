import React from "react";
import { X } from 'lucide-react';

// 1. Naya prop 'onCheckout' add karein
const CartPopup = ({ isOpen, onClose, darkMode, cartItems, onRemoveItem, onUpdateQuantity, onViewProductDetails, onCheckout }) => {
  if (!isOpen) return null;

  // Total price calculate karein
  const totalPrice = cartItems.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace(/[$,Rs]/g, '').replace(/,/g, ''));
    return total + (priceNumber * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50" onClick={onClose}>
      <div
        className={`w-full max-w-md h-full flex flex-col ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.name}`} className="flex items-center space-x-4">
                <img
                  src={item.image || `https://placehold.co/100x100/34D399/ffffff?text=${item.name.replace(/\s/g, '+')}`}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover cursor-pointer hover:opacity-80"
                  onClick={() => onViewProductDetails(item)}
                />
                <div className="flex-1">
                  <h3 
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => onViewProductDetails(item)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-green-700">{item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total Price & Checkout) */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-700">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            
            {/* 2. Button ka onClick update karein */}
            <button 
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-3 font-bold"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPopup;