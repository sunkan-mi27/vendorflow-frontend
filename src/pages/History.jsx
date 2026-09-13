import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

function History() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["history"],
    queryFn: () => api.get("/orders/history").then((res) => res.data),
  });

  if (isLoading)
    return <p style={{ padding: 40 }}>Loading your sales history...</p>;
  if (isError) return <p style={{ padding: 40 }}>Something went wrong.</p>;

  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="app-shell">
      <div className="header-row">
        <div>
          <h1 className="brand">Sales History</h1>
          <p className="brand-sub">
            Every order you've ever recorded, safely kept.
          </p>
        </div>
        <Link className="btn-ghost" to="/dashboard">
          ← Back to Dashboard
        </Link>
      </div>

      {orders.length > 0 && (
        <div className="summary-strip">
          <div className="summary-item">
            <div className="value">{orders.length}</div>
            <div className="label">Total orders recorded</div>
          </div>
          <div className="summary-item">
            <div className="value">₦{totalSales.toLocaleString()}</div>
            <div className="label">Lifetime total</div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state">
          Nothing archived yet — cleared orders will show up here.
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-main">
                <span className="order-customer">{order.customerName}</span>
                <span className="order-detail">
                  {order.item} · ₦{order.amount.toLocaleString()} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={`badge badge-${order.status}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
