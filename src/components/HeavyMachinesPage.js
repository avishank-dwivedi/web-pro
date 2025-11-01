import React, { useState, useCallback, useEffect } from "react"; 
import {
  Search, ShoppingCart, User, Sun, Moon, X
} from 'lucide-react';
import AuthPopup from "./Authpopup";
import PasswordResetPopup from "./PasswordResetPopup";
import CartPopup from "./CartPopup"; // Cart popup import

const PRIMARY_COLOR = "bg-green-600 hover:bg-green-700";
const TEXT_COLOR = "text-green-700";
const ICON_CLASS = "w-5 h-5 text-green-700";
const API_BASE_URL = "http://localhost:8000";

const companies = [
  { id: 1, name: "Sonalika", logo: "/images/sonalika.png", slogan: "Powering Prosperity" },
  { id: 2, name: "Machino", logo: "/images/machino.png", slogan: "Future Farming" },
  { id: 3, name: "KrishKing", logo: "/images/krishkinglogo.png", slogan: "King of the Field" },
  { id: 4, name: "Shaktiman", logo: "/images/shaktiman.jpg", slogan: "Strength in Soil" },
];

const ProductCard = ({ product, onClick, onAddToCart }) => (
  <div
    className="flex-shrink-0 w-64 md:w-72 lg:w-80 cursor-pointer group bg-white p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
  >
    <img
      src={product.image || `https://placehold.co/400x250/34D399/ffffff?text=${product.name.replace(/\s/g, '+')}`}
      alt={product.name}
      onClick={() => onClick(product)} 
      onError={(e) => {
        e.target.onerror = null;
        e.target.src="https://placehold.co/400x250/cccccc/333333?text=Image+Unavailable";
      }}
      className="rounded-lg w-full h-40 object-cover mb-3 transition-transform duration-300 group-hover:opacity-90 cursor-pointer" 
    />
    <div className="flex flex-col">
      <div 
        className="font-semibold text-lg text-gray-800 truncate cursor-pointer" 
        onClick={() => onClick(product)} 
      >
        {product.name}
      </div>
      <div className="font-extrabold text-xl mt-1 text-green-700">{product.price}</div>
      <button
        onClick={() => onAddToCart(product)} 
        className={`mt-3 px-4 py-2 rounded-full text-white font-medium transition ${PRIMARY_COLOR} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
      >Add to Cart</button>
    </div>
  </div>
);

const HeavyMachinesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productRows, setProductRows] = useState([]);
  
  // --- Modal Control Functions ---
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogoutFromMenu = () => {
    setCurrentUser(null);
    setIsProfileMenuOpen(false); 
  };

  const openLoginModalFromMenu = () => {
    setIsProfileMenuOpen(false); 
    setIsAuthModalOpen(true); 
  };

  const closeResetModal = useCallback(() => {
    setIsResetModalOpen(false);
  }, []);

  const openResetModal = () => {
    closeAuthModal(); 
    setIsResetModalOpen(true); 
  };
  
  // --- NAYA FUNCTION ---
  // Cart se product details kholne ke liye
  const handleViewProductDetails = (product) => {
    setIsCartOpen(false); // Cart ko band karein
    setSelectedProduct(product); // Product modal ko kholein
  };
  // --- YAHAN TAK ---

  // Cart mein product jodne ke liye function
  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id && item.name === productToAdd.name);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id && item.name === productToAdd.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };
  
  // Cart se item hatane aur quantity update karne ke functions
  const handleRemoveItem = (itemToRemove) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.id === itemToRemove.id && item.name === itemToRemove.name)
      )
    );
  };

  const handleUpdateQuantity = (itemToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemToUpdate);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemToUpdate.id && item.name === itemToUpdate.name
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Cart icon par total quantity dikhane ke liye helper
  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // API se data laane ke liye useEffect
  useEffect(() => {
    const fetchAllProductData = async () => {
      try {
        const [
          trendingRes, 
          heavyRes, 
          latestRes, 
          componentsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/products/trending`),
          fetch(`${API_BASE_URL}/products/heavy`),
          fetch(`${API_BASE_URL}/products/latest`),
          fetch(`${API_BASE_URL}/products/components`) 
        ]);

        const trendingData = await trendingRes.json();
        const heavyData = await heavyRes.json();
        const latestData = await latestRes.json();
        const componentsData = await componentsRes.json();

        setTrendingProducts(trendingData);
        
        setProductRows([
          { id: 1, title: "Heavy Machines", products: heavyData },
          { id: 2, title: "Latest Machines", products: latestData },
          { id: 3, title: "Components / Parts", products: componentsData },
        ]);

      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };
    
    fetchAllProductData();
  }, []);

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-gray-200 min-h-screen font-sans transition duration-300"
          : "bg-gray-50 text-gray-900 min-h-screen font-sans transition duration-300"
      }
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <header className={`shadow-lg p-4 flex flex-wrap items-center justify-between sticky top-0 z-40 transition duration-300 ${darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-200'}`}>
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
            <img src="/images/Logo.png" alt="AgriShop Logo" className="h-12 w-auto" />
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 mx-4 sm:mx-6 min-w-[150px] max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tractors, rotavators, parts..."
              className={`w-full p-2 pl-10 rounded-full border focus:outline-none transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' : 'bg-gray-100 border-gray-200 focus:bg-white'}`}
            />
          </div>
        </div>
        
        {/* Header Icons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          
          {/* Shopping Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className={`relative p-2 rounded-full transition ${darkMode ? 'text-green-300 hover:bg-gray-700' : 'text-green-700 hover:bg-gray-100'}`}
          >
            <ShoppingCart className={ICON_CLASS} />
            {totalCartQuantity > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {totalCartQuantity}
              </span>
            )}
          </button>
          
          {/* Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`p-2 rounded-full transition ${darkMode ? 'text-green-300 hover:bg-gray-700' : 'text-green-700 hover:bg-gray-100'}`}
              title="Profile"
            >
              <User className={ICON_CLASS} />
            </button>

            {isProfileMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-50`}
                onMouseLeave={() => setIsProfileMenuOpen(false)} 
              >
                {currentUser ? (
                  <>
                    <span className={`block px-4 py-2 text-sm font-medium border-b ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'}`}>
                      {currentUser.name}
                    </span>
                    <button
                      onClick={handleLogoutFromMenu}
                      className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <span className={`block px-4 py-2 text-sm font-medium border-b ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'}`}>
                      Guest
                    </span>
                    <button
                      onClick={openLoginModalFromMenu}
                      className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Login / Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-green-700 hover:bg-gray-100'}`}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <section className={`p-6 rounded-2xl shadow-xl mb-10 transition duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${TEXT_COLOR}`}>Top Brands & Partners</h2>
          <div className="flex overflow-x-auto space-x-8 md:space-x-12 pb-2 scrollbar-hide">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer group w-24 md:w-32"
                title={company.slogan}
              >
                <div className="relative p-1 rounded-full border-4 border-transparent group-hover:border-green-500 transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/100x100/34D399/ffffff?text=${company.name}`;
                    }}
                  />
                </div>
                <span className={`text-center mt-2 text-sm font-medium transition duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className={`text-3xl font-extrabold mb-6 ${TEXT_COLOR}`}>
            🔥 Trending Machines & Equipment
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {trendingProducts.map((product) => (
              <ProductCard
                key={`${product.id}-${product.name}-trending`}
                product={product}
                onClick={setSelectedProduct}
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </section>

        {productRows.map((row) => (
          <section key={row.id} className="mb-10">
            <h2 className={`text-2xl font-bold mb-4 ${TEXT_COLOR}`}>{row.title}</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {row.products.map((product) => (
                <ProductCard
                  key={`${product.id}-${product.name}-${row.id}`} 
                  product={product}
                  onClick={setSelectedProduct}
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className={`p-8 mt-8 text-sm transition duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'}`}>
         <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* ... (Footer content) ... */}
         </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
           <div
            className="bg-white rounded-2xl shadow-2xl relative w-full max-w-lg transition-transform duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
           >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="rounded-t-2xl w-full h-64 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src="https://placehold.co/400x250/cccccc/333333?text=Image+Unavailable";
                }}
              />
              <div className="p-6">
                <h3 className="text-3xl font-extrabold text-gray-800">{selectedProduct.name}</h3>
                <p className="text-2xl font-bold text-green-700 mt-1 mb-3">{selectedProduct.price}</p>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                <button 
                  onClick={() => {
                    handleAddToCart(selectedProduct); 
                    setSelectedProduct(null); 
                    setIsCartOpen(true); 
                  }}
                  className={`w-full py-3 rounded-full text-white font-semibold transition shadow-md ${PRIMARY_COLOR}`}>
                  Buy Now & View Cart
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Auth Popup */}
      <AuthPopup 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        darkMode={darkMode}
        onLoginSuccess={handleLoginSuccess}
        onForgotPasswordClick={openResetModal} 
      />
      
      {/* Password Reset Popup */}
      <PasswordResetPopup
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        darkMode={darkMode}
      />

      {/* --- Cart Popup --- */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        darkMode={darkMode}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onViewProductDetails={handleViewProductDetails} // <-- 4. Naya function pass karein
      />
      
    </div>
  );
};

export default HeavyMachinesPage;