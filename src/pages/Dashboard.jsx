import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    item: "",
    amount: "",
  });

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((res) => res.data),
  });

  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: () => api.get("/orders/summary").then((res) => res.data),
  });

  const addOrderMutation = useMutation({
    mutationFn: (newOrder) => api.post("/orders", newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      setForm({ customerName: "", customerPhone: "", item: "", amount: "" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/orders/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrderMutation.mutate(form);
  };

  if (isLoading) return <p style={{ padding: 40 }}>Loading orders...</p>;
  if (isError)
    return <p style={{ padding: 40 }}>Something went wrong fetching orders.</p>;

  return (
    <div className="app-shell">
      <div className="header-row">
        <div>
          <h1 className="brand">VendorFlow</h1>
          <p className="brand-sub">
            Order tracking, without losing anyone in the chat.
          </p>
        </div>
        <button className="btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {summary && (
        <div className="summary-strip">
          <div className="summary-item">
            <div className="value">{summary.count}</div>
            <div className="label">Orders today</div>
          </div>
          <div className="summary-item">
            <div className="value">₦{summary.total.toLocaleString()}</div>
            <div className="label">Total today</div>
          </div>
        </div>
      )}

      <form className="order-form" onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Customer name"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        <input
          name="customerPhone"
          placeholder="Phone (2348...)"
          value={form.customerPhone}
          onChange={handleChange}
          required
        />
        <input
          name="item"
          placeholder="Item"
          value={form.item}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <button className="btn-primary" type="submit">
          Add order
        </button>
      </form>

      {orders.length === 0 ? (
        <div className="empty-state">
          No orders yet — add your first one above.
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-main">
                <span className="order-customer">{order.customerName}</span>
                <span className="order-detail">
                  {order.item} · ₦{order.amount.toLocaleString()}
                </span>
              </div>

              <div className="order-actions">
                <span className={`badge badge-${order.status}`}>
                  {order.status}
                </span>
                {order.status !== "paid" && (
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: order.id,
                        status: "paid",
                      })
                    }
                  >
                    Mark paid
                  </button>
                )}
                {order.status !== "shipped" && (
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: order.id,
                        status: "shipped",
                      })
                    }
                  >
                    Mark shipped
                  </button>
                )}
                <a
                  className="btn-whatsapp"
                  href={`https://wa.me/${order.customerPhone}?text=${encodeURIComponent(
                    `Hi ${order.customerName}, your order for ${order.item} is now ${order.status}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
