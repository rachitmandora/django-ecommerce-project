import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = () => {
    fetch("http://127.0.0.1:8000/api/cart/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increase = (id) => {
    fetch(`http://127.0.0.1:8000/api/increase/${id}/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => fetchCart());
  };

  const decrease = (id) => {
    fetch(`http://127.0.0.1:8000/api/decrease/${id}/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => fetchCart());
  };

  const removeItem = (id) => {
    fetch(`http://127.0.0.1:8000/api/remove/${id}/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => fetchCart());
  };

  const total = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  return (
    <div style={{ padding: "20px", background: "#f1f3f6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>🛒 Your Cart</h1>

      {cart.length === 0 && (
        <p style={{ fontSize: "18px" }}>Your cart is empty</p>
      )}

      {/* 🔥 Layout */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* LEFT: Items */}
        <div style={{ flex: 3 }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "20px",
                background: "#fff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {/* ✅ IMAGE */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              {/* INFO */}
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>

                <p style={{ fontWeight: "bold" }}>
                  ₹{item.price} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </p>

                {/* ➖ ➕ */}
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => decrease(item.id)}>➖</button>

                  <span style={{ margin: "0 10px" }}>
                    {item.quantity}
                  </span>

                  <button onClick={() => increase(item.id)}>➕</button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    marginTop: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            height: "fit-content",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Price Details</h2>

          <hr />

          <p style={{ fontSize: "18px" }}>
            Total: <b>₹{total}</b>
          </p>

          <button
            onClick={() =>
              navigate("/checkout", { state: { cart: cart, total: total } })
            }
            style={{
              width: "100%",
              padding: "12px",
              background: "#ff9f00",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;