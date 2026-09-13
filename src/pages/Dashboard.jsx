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
  const [showUpgrade, setShowUpgrade] = useState(false);
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
    onError: (error) => {
      if (error?.response?.data?.code === "UPGRADE_REQUIRED") {
        setShowUpgrade(true);
      }
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

  const handleUpgrade = () => {
    const email = localStorage.getItem("vendorEmail");

    const handler = window.PaystackPop.setup({
      key: "pk_test_f1eae695bf442c9dffff788d12aba0789f4134d6",
      email: email,
      amount: 250000,
      currency: "NGN",
      callback: function (response) {
        api
          .post("/payments/verify", { reference: response.reference })
          .then(() => {
            setShowUpgrade(false);
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            alert("Payment successful! You can now add unlimited orders.");
          })
          .catch(() => {
            alert("Payment verification failed. Please contact support.");
          });
      },
      onClose: function () {
        console.log("Payment window closed");
      },
    });

    handler.openIframe();
  };

  if (isLoading) return <p style={{ padding: 40 }}>Loading orders...</p>;
  if (isError)
    return <p style={{ padding: 40 }}>Something went wrong fetching orders.</p>;

  return (
    <div className="app-shell">
      <div className="header-row">
        <div>
          <h1 className="brand">{localStorage.getItem("businessName")}</h1>
          <p className="brand-sub">
            Order tracking, without losing anyone in the chat.Powered by
            VendorFlow
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

      {!showUpgrade && (
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
      )}

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

      {showUpgrade && (
        <div className="upgrade-banner">
          <p>
            You've used your 3 free orders. Upgrade to keep tracking unlimited
            orders.
          </p>
          <button className="btn-primary" onClick={handleUpgrade}>
            Upgrade now ⇢ ₦2,500/month
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
