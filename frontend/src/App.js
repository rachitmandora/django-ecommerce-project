import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Success from "./Success";
import Login from "./Login";
import Orders from "./Orders";


function App() {

  // ✅ REAL CART COUNT (from backend)
  const [cartCount, setCartCount] = useState(0);

  // 🔥 Fetch cart count from backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://127.0.0.1:8000/api/cart/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Cart Count API:", data);

        if (Array.isArray(data)) {
          const totalItems = data.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          setCartCount(totalItems);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Router>

      {/* 🔥 NAVBAR */}
      <nav
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#2874f0",
    color: "white",
  }}
>
  {/* LEFT */}
  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
    <h2 style={{ margin: 0 }}>MyStore 🛍️</h2>

    <Link to="/" style={{ color: "white", textDecoration: "none" }}>
      Home
    </Link>

    <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
      Cart 🛒 ({cartCount})
    </Link>

    <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
      Orders 📦
    </Link>
  </div>

  {/* 🔍 SEARCH */}
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const query = e.target.search.value;
      window.location.href = `/?search=${query}`;
    }}
    style={{ flex: 1, margin: "0 20px" }}
  >
    <input
      name="search"
      placeholder="Search products..."
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "5px",
        border: "none",
      }}
    />
  </form>

  {/* RIGHT */}
  <div>
    {localStorage.getItem("token") ? (
      <button
        onClick={() => {
          localStorage.removeItem("token");
          alert("Logged out");
          window.location.href = "/login";
        }}
        style={{
          padding: "8px 12px",
          background: "white",
          color: "#2874f0",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout 🔓
      </button>
    ) : (
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
        Login 🔐
      </Link>
    )}
  </div>
</nav>

      {/* ✅ ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

    </Router>
  );
}

export default App;