import React from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f3f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 🔥 CARD */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h1 style={{ color: "green", marginBottom: "15px" }}>
          ✅ Payment Successful
        </h1>

        <p style={{ marginBottom: "25px", color: "gray" }}>
          Your order has been placed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px",
            width: "100%",
            background: "#2874f0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Go to Home 🏠
        </button>
      </div>
    </div>
  );
}

export default Success;