import React, { useState, useEffect } from "react";
import AuthPopup from "./Authpopup"; // ← Import the new Popup

// ---------------- Dummy Data ---------
const companies = [
  { id: 1, name: "Sonalika", logo: "/images/sonalika.png" },
  { id: 2, name: "Machino", logo: "/images/machino.png" },
  { id: 3, name: "KrishKing", logo: "/images/krishking.jpg" },
  { id: 4, name: "Shaktiman", logo: "/images/shaktiman.jpeg" },
];

const trendingProducts = [
  { id: 1, name: "Sonalika", price: "100000", image: "/images/sonalikaimg.jpg" },
  { id: 2, name: "shaktiman", price: "120000", image: "/images/shaktimanimg.jpg" },
  { id: 3, name: "machino", price: "150000", image: "/images/machinoimg.jpg" },
  { id: 4, name: "krishking", price: "83000", image: "/images/krishkingimg.jpg" },
];

const heavyMachines = [
  { id: 1, name: "Rotavator", price: "5000", image: "/images/sonalikaimg.jpg" },
  { id: 2, name: "Combine Harvester", price: "12000", image: "/images/sonalikaimg.jpg" },
  { id: 3, name: "Tractor", price: "20000", image: "/images/machinoimg.jpg" },
  { id: 4, name: "Seeder", price: "3000", image: "/images/shaktimanimg.jpg" },
];

const latestMachines = [
  { id: 1, name: "Plough", price: "2500", image: "/images/krishkingimg.jpg" },
  { id: 2, name: "Sprayer", price: "1500", image: "/images/machinoimg.jpg" },
  { id: 3, name: "Baler", price: "8000", image: "/images/sonalikaimg.jpg" },
  { id: 4, name: "Seeder", price: "3000", image: "/images/shaktimanimg.jpg" },
];

const productRows = [
  { id: 1, title: "Heavy Machines", products: heavyMachines },
  { id: 2, title: "Latest Machines", products: latestMachines },
  { id: 3, title: "Components / Parts", products: trendingProducts },
];

const ProductCard = ({ product, onClick }) => (
  <div
    className="flex-shrink-0 w-48 md:w-64 cursor-pointer group"
    onClick={() => onClick(product)}
  >
    <img
      src={product.image}
      alt={product.name}
      className="rounded shadow-md w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="text-center mt-2">
      <div className="font-semibold text-gray-700">{product.name}</div>
      <div className="font-bold text-green-700 mt-1">{product.price}</div>
      <button className="mt-2 px-3 py-1 border rounded bg-green-200 hover:bg-green-300 transition">
        Add to Cart
      </button>
    </div>
  </div>
);

const HeavyMachinesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Auto-scroll for carousels
  useEffect(() => {
    const carousels = document.querySelectorAll(".auto-scroll");
    const intervals = [];

    carousels.forEach((carousel) => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (carousel.children.length > 0) {
          currentIndex = (currentIndex + 1) % carousel.children.length;
          carousel.scrollTo({
            left: currentIndex * carousel.clientWidth,
            behavior: "smooth",
          });
        }
      }, 4000);
      intervals.push(interval);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className={darkMode ? "bg-black text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      {/* Header */}
      <header className="bg-white shadow p-4 flex flex-wrap items-center justify-between sticky top-0 z-40">
        <div className="flex items-center flex-shrink-0">
          <img src="/images/Logo.png" alt="AgriShop" className="w-28 h-16 object-contain" />
        </div>
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 rounded-md border border-gray-300 bg-gray-100 focus:bg-gray-50 focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition">Contact</button>
          <button
            className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => setAuthOpen(true)}>
            Login
          </button>
          <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition">🛒</button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Toggle dark mode">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Companies Logos */}
      <section className="flex overflow-x-auto space-x-10 p-4 bg-white mt-4 rounded shadow">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group relative"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="w-28 h-28 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-center">{company.name}</span>
            <span className="absolute bottom-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Products
            </span>
          </div>
        ))}
      </section>

      {/* Trending Products */}
      <section className="p-4 bg-white rounded shadow mt-6">
        <h2 className="text-2xl font-extrabold mb-4 text-gray-800">🔥 Trending Products</h2>
        <div className="relative flex overflow-x-auto space-x-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
        </div>
      </section>

      {/* Product Rows */}
      {productRows.map((row) => (
        <section key={row.id} className="p-4">
          <h2 className="text-lg font-bold mb-2">{row.title}</h2>
          <div className="relative flex overflow-x-auto snap-x snap-mandatory space-x-4 auto-scroll">
            {row.products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-full md:w-96 snap-start">
                <ProductCard product={product} onClick={setSelectedProduct} />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="bg-white shadow p-6 mt-8 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>📍 Address: 123 Agri Lane, City</div>
          <div>📞 Phone: +91 1234567890</div>
          <div>✉️ Email: info@agrishop.com</div>
          <div>🌐 Follow us: Instagram | Twitter</div>
          <div>🗺 Map: (Google Maps Embed)</div>
        </div>
      </footer>

      {/* Product Popup */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedProduct(null)}>
          <div
            className="bg-white p-4 rounded shadow-lg relative w-96"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="rounded w-full h-64 object-cover"
            />
            <div className="mt-2">
              <h3 className="text-lg font-bold">{selectedProduct.name}</h3>
              <p className="font-bold text-green-700">{selectedProduct.price}</p>
              <button className="mt-2 px-2 py-1 border rounded bg-green-200">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Popup: Login/Signup */}
      <AuthPopup open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default HeavyMachinesPage;
