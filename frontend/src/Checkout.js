import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const total = location.state?.total || 0;

  const handlePayment = () => {
    fetch("http://127.0.0.1:8000/api/save-order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        cart: cart,
        total: total,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Payment Successful ✅");
        navigate("/success");
      });
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>🧾 Checkout</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* LEFT: ITEMS */}
        <div style={{ flex: 3 }}>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "15px",
                background: "#fff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
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
          <h2>Order Summary</h2>

          <hr />

          <p style={{ fontSize: "18px" }}>
            Total: <b>₹{total}</b>
          </p>

          <button
            onClick={handlePayment}
            style={{
              width: "100%",
              padding: "12px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Pay Now 💳
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;