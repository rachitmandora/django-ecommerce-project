import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS:", data);
        setOrders(Array.isArray(data) ? data : []);
      });
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f1f3f6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>📦 My Orders</h1>

      {orders.length === 0 ? (
        <p style={{ fontSize: "18px" }}>No orders yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                gap: "20px",
                background: "#fff",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {/* ✅ IMAGE (if available) */}
              {o.image && (
                <img
                  src={o.image}
                  alt={o.product}
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
                <h3>{o.product}</h3>

                <p style={{ fontWeight: "bold" }}>₹{o.price}</p>

                <p>Quantity: {o.quantity}</p>

                <p style={{ color: "green", fontWeight: "bold" }}>
                  ✅ Order Placed
                </p>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Orders;