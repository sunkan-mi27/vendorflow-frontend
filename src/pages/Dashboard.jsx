import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

const motivations = [
  "Every order today is a step closer to the business you're building..DONT STOP!!!",
  "Small hustle now, big empire later. Keep going if you do bilieve in yourself....",
  "You didn't come this far to stop here...Remember why you started.",
  "Consistency beats motivation. Show up today. Show up tomorrow. Show up Every blessed DAYYYYY",
  "Your customers remember who never let them down..Keep satisfying their NEEDS not WANTS....Best of Luck",
  "Rough days build the businesses that last...Why you wanna stop?",
  "One more order today. That's the whole game..Play it right.",
  "Nobody sees the late nights. They see the results.",
  "You're not just selling. You're building a name. Keep Pushing, Keep Praying and keep the Positive Energyyyy",
  "Champions track their numbers. You're already ahead CHAMPS🏆.",
  "The grind is quiet, but the results won't be. Remember Never to stop. Fuel your Engine",
  "Today's sales are tomorrow's proof you never gave up. You got a real Story to tell....",
  "Discipline today. Freedom tomorrow. Proud of yourself in Future",
  "Every 'yes' from a customer is a vote of trust. Earn it again today. Dont stop earning their TRUST",
  "You're not behind dont think so. You're building a better LifePlan.",
];

const platformConfig = {
  whatsapp: {
    label: "WhatsApp",
    placeholder: "Phone (2348...)",
    buildLink: (contact, order) =>
      `https://wa.me/${contact}?text=${encodeURIComponent(
        `Hi ${order.customerName}, your order for ${order.item} is now ${order.status}.`,
      )}`,
    buttonLabel: "WhatsApp →",
  },
  instagram: {
    label: "Instagram",
    placeholder: "Instagram handle (without @)",
    buildLink: (contact) => `https://instagram.com/${contact}`,
    buttonLabel: "Instagram →",
  },
  tiktok: {
    label: "TikTok",
    placeholder: "TikTok handle (without @)",
    buildLink: (contact) => `https://tiktok.com/@${contact}`,
    buttonLabel: "TikTok →",
  },
  twitter: {
    label: "Twitter/X",
    placeholder: "Twitter/X handle (without @)",
    buildLink: (contact) => `https://x.com/${contact}`,
    buttonLabel: "Twitter/X →",
  },
};

function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const vendorPlatform = localStorage.getItem("vendorPlatform") || "whatsapp";
  const config = platformConfig[vendorPlatform] || platformConfig.whatsapp;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [motivation] = useState(
    motivations[Math.floor(Math.random() * motivations.length)],
  );
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    item: "",
    amount: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

  const resetSummaryMutation = useMutation({
    mutationFn: () => api.post("/orders/reset-summary"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (status) => api.post("/orders/archive", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowManage(false);
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrderMutation.mutate(form);
  };

  const handleReset = () => {
    if (window.confirm("Reset your order count and total back to zero?")) {
      resetSummaryMutation.mutate();
    }
  };

  const handleArchive = (status) => {
    const labels = {
      all: "all orders",
      paid: "paid orders",
      shipped: "shipped orders",
    };
    if (window.confirm(`Move ${labels[status]} to your Sales History?`)) {
      archiveMutation.mutate(status);
    }
  };

  const handleUpgrade = () => {
    const email = localStorage.getItem("vendorEmail");

    const handler = window.PaystackPop.setup({
      key: "pk_live_d5b0c4d47269c3d96b948de6eac35c9b18469219",
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
          <h1 className="brand">
            {localStorage.getItem("businessName") || "VendorFlow"}
          </h1>
          <p className="brand-sub">Powered by VendorFlow</p>
          <p className="motivation">{motivation}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn-ghost" to="/history">
            Sales History
          </Link>
          <button className="btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {summary && (
        <div className="summary-strip">
          <div className="summary-item">
            <div className="value">{summary.count}</div>
            <div className="label">Orders</div>
          </div>
          <div className="summary-item">
            <div className="value">₦{summary.total.toLocaleString()}</div>
            <div className="label">Total</div>
          </div>
          <button
            className="btn-reset"
            onClick={handleReset}
            title="Reset counter to zero"
          >
            ↻ Reset
          </button>
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
            placeholder={config.placeholder}
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

      <div className="list-header">
        <span className="list-title">Active Orders</span>
        <div className="manage-wrapper">
          <button
            className="btn-ghost"
            onClick={() => setShowManage(!showManage)}
          >
            Manage ▾
          </button>
          {showManage && (
            <div className="manage-menu">
              <button onClick={() => handleArchive("paid")}>Clear paid</button>
              <button onClick={() => handleArchive("shipped")}>
                Clear shipped
              </button>
              <button onClick={() => handleArchive("all")}>Clear all</button>
            </div>
          )}
        </div>
      </div>

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
                  href={config.buildLink(order.customerPhone, order)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.buttonLabel}
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
            Upgrade now — ₦2,500/month
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
