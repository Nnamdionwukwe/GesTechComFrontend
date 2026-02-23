// src/components/admin/CartManagement.jsx
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Users,
  TrendingDown,
  Package,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BarChart2,
  Clock,
} from "lucide-react";
import styles from "./CartManagement.module.css";
import useAuthStore from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ── Currency formatter ────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// ── Relative time ─────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CartManagement() {
  const { accessToken } = useAuthStore();
  const authHeader = { Authorization: `Bearer ${accessToken}` };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── All carts list ────────────────────────────────────────────────────────
  const [carts, setCarts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [listLoading, setListLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // ── Cart detail drawer ────────────────────────────────────────────────────
  const [drawerCart, setDrawerCart] = useState(null); // full cart object
  const [drawerUserId, setDrawerUserId] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [clearTarget, setClearTarget] = useState(null); // userId to clear
  const [clearing, setClearing] = useState(false);
  const [flash, setFlash] = useState({ msg: "", type: "" });

  function showFlash(msg, type = "success") {
    setFlash({ msg, type });
    setTimeout(() => setFlash({ msg: "", type: "" }), 3500);
  }

  // ── Fetch stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/admin/stats`, {
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Cart stats error:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [accessToken]);

  // ── Fetch all carts ───────────────────────────────────────────────────────
  const fetchCarts = useCallback(async () => {
    setListLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search }),
      });
      const res = await fetch(`${API_URL}/api/cart/admin/all?${params}`, {
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) {
        setCarts(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Fetch carts error:", err);
    } finally {
      setListLoading(false);
    }
  }, [accessToken, page, search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  // ── View user cart detail ─────────────────────────────────────────────────
  async function openDrawer(userId) {
    setDrawerUserId(userId);
    setDrawerCart(null);
    setDrawerLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/admin/user/${userId}`, {
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) setDrawerCart(data.data);
    } catch (err) {
      showFlash("Failed to load cart details", "error");
      setDrawerUserId(null);
    } finally {
      setDrawerLoading(false);
    }
  }

  function closeDrawer() {
    setDrawerUserId(null);
    setDrawerCart(null);
  }

  // ── Clear user cart ───────────────────────────────────────────────────────
  async function confirmClear() {
    setClearing(true);
    try {
      await fetch(`${API_URL}/api/cart/admin/user/${clearTarget}/clear`, {
        method: "DELETE",
        headers: authHeader,
      });
      showFlash("Cart cleared successfully");
      setClearTarget(null);
      fetchCarts();
      fetchStats();
      if (drawerUserId === clearTarget) closeDrawer();
    } catch (err) {
      showFlash(err.response?.data?.error || "Failed to clear cart", "error");
    } finally {
      setClearing(false);
    }
  }

  // ── Search debounce ───────────────────────────────────────────────────────
  let searchTimer;
  function handleSearch(val) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      {/* Flash message */}
      {flash.msg && (
        <div
          className={`${styles.flash} ${flash.type === "error" ? styles.flashError : styles.flashSuccess}`}
        >
          {flash.msg}
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className={styles.statGrid}>
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.statCard} ${styles.skeleton}`} />
          ))
        ) : stats ? (
          <>
            <StatCard
              icon={<ShoppingCart size={22} />}
              color="#3b82f6"
              label="Total Carts"
              value={Number(stats.overview?.total_carts ?? 0).toLocaleString()}
            />
            <StatCard
              icon={<Package size={22} />}
              color="#10b981"
              label="Total Items"
              value={Number(stats.overview?.total_items ?? 0).toLocaleString()}
            />
            <StatCard
              icon={<BarChart2 size={22} />}
              color="#f59e0b"
              label="Avg Cart Value"
              value={fmt(stats.overview?.avg_cart_value)}
            />
            <StatCard
              icon={<TrendingDown size={22} />}
              color="#ef4444"
              label="Abandoned Carts"
              value={Number(
                stats.overview?.abandoned_carts ?? 0,
              ).toLocaleString()}
              sub="inactive 7+ days"
            />
          </>
        ) : null}
      </div>

      {/* ── Details row: top products + abandoned ── */}
      {!statsLoading && stats && (
        <div className={styles.detailRow}>
          {/* Top carted products */}
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>
              <Package size={16} /> Top Carted Products
            </h3>
            {stats.topProducts?.length === 0 && (
              <p className={styles.emptyNote}>No product data yet</p>
            )}
            {stats.topProducts?.map((p, i) => (
              <div key={p.id} className={styles.topRow}>
                <span className={styles.topRank}>#{i + 1}</span>
                <span className={styles.topName}>{p.name}</span>
                <span className={styles.topCount}>{p.times_carted} carts</span>
              </div>
            ))}
          </div>

          {/* Abandoned carts */}
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>
              <Clock size={16} /> Abandoned Carts
              <span className={styles.detailBadge}>
                {stats.overview?.abandoned_carts ?? 0}
              </span>
            </h3>
            {stats.abandonedCarts?.length === 0 && (
              <p className={styles.emptyNote}>No abandoned carts 🎉</p>
            )}
            {stats.abandonedCarts?.map((c) => (
              <div key={c.id} className={styles.abandonRow}>
                <div className={styles.abandonInfo}>
                  <span className={styles.abandonName}>
                    {c.full_name || "Unknown"}
                  </span>
                  <span className={styles.abandonEmail}>{c.email}</span>
                </div>
                <div className={styles.abandonRight}>
                  <span className={styles.abandonValue}>{fmt(c.total)}</span>
                  <span className={styles.abandonAge}>
                    {timeAgo(c.updated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name or email…"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => {
            fetchCarts();
            fetchStats();
          }}
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── Carts table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}>
                      <div
                        className={`${styles.skeleton} ${styles.skeletonCell}`}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : carts.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  <ShoppingCart size={32} style={{ opacity: 0.2 }} />
                  <p>No carts found</p>
                </td>
              </tr>
            ) : (
              carts.map((cart) => (
                <tr key={cart.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {(cart.full_name || "?")[0].toUpperCase()}
                      </div>
                      <span className={styles.userName}>
                        {cart.full_name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{cart.email || "—"}</td>
                  <td>
                    <span className={styles.itemBadge}>{cart.item_count}</span>
                  </td>
                  <td className={styles.totalCell}>{fmt(cart.total)}</td>
                  <td className={styles.dateCell}>
                    {timeAgo(cart.updated_at)}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => openDrawer(cart.user_id)}
                        title="View cart"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={styles.clearBtn}
                        onClick={() => setClearTarget(cart.user_id)}
                        title="Clear cart"
                        disabled={Number(cart.item_count) === 0}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const start = Math.max(
                1,
                Math.min(page - 2, pagination.pages - 4),
              );
              const n = start + i;
              return (
                <button
                  key={n}
                  className={`${styles.pageBtn} ${page === n ? styles.pageBtnActive : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              );
            })}
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.pages}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Cart Detail Drawer ── */}
      {drawerUserId && (
        <div className={styles.drawerOverlay} onClick={closeDrawer}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Cart Details</h2>
              <button className={styles.drawerClose} onClick={closeDrawer}>
                <X size={18} />
              </button>
            </div>

            {drawerLoading ? (
              <div className={styles.drawerLoading}>
                <div className={styles.spinner} />
                <p>Loading cart…</p>
              </div>
            ) : drawerCart ? (
              <>
                <div className={styles.drawerMeta}>
                  <div className={styles.drawerMetaItem}>
                    <span className={styles.drawerMetaLabel}>Subtotal</span>
                    <span className={styles.drawerMetaValue}>
                      {fmt(drawerCart.subtotal)}
                    </span>
                  </div>
                  <div className={styles.drawerMetaItem}>
                    <span className={styles.drawerMetaLabel}>Total</span>
                    <span
                      className={`${styles.drawerMetaValue} ${styles.drawerTotal}`}
                    >
                      {fmt(drawerCart.total)}
                    </span>
                  </div>
                  <div className={styles.drawerMetaItem}>
                    <span className={styles.drawerMetaLabel}>Items</span>
                    <span className={styles.drawerMetaValue}>
                      {drawerCart.items.length}
                    </span>
                  </div>
                </div>

                <div className={styles.drawerItems}>
                  {drawerCart.items.length === 0 ? (
                    <p className={styles.emptyNote}>Cart is empty</p>
                  ) : (
                    drawerCart.items.map((item) => (
                      <div key={item.id} className={styles.drawerItem}>
                        {/* Product or service thumbnail */}
                        <div className={styles.drawerThumb}>
                          {item.type === "product" &&
                          item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className={styles.drawerImg}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <Package size={20} style={{ opacity: 0.4 }} />
                          )}
                        </div>

                        <div className={styles.drawerItemInfo}>
                          <p className={styles.drawerItemName}>
                            {item.type === "product"
                              ? item.product?.name
                              : `${item.service?.name} — ${item.variant?.name}`}
                          </p>
                          <p className={styles.drawerItemSub}>
                            {item.type === "product"
                              ? `Stock: ${item.product?.stock ?? "—"}`
                              : (item.variant?.duration ?? "")}
                          </p>
                        </div>

                        <div className={styles.drawerItemRight}>
                          <span className={styles.drawerItemQty}>
                            ×{item.quantity}
                          </span>
                          <span className={styles.drawerItemPrice}>
                            {fmt(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  className={styles.drawerClearBtn}
                  onClick={() => {
                    closeDrawer();
                    setClearTarget(drawerUserId);
                  }}
                >
                  <Trash2 size={15} /> Clear this cart
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Clear Confirmation Modal ── */}
      {clearTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setClearTarget(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>
            <h3 className={styles.modalTitle}>Clear this cart?</h3>
            <p className={styles.modalBody}>
              All items will be permanently removed from this user's cart. This
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setClearTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={confirmClear}
                disabled={clearing}
              >
                {clearing ? "Clearing…" : "Clear Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, color, label, value, sub }) {
  return (
    <div className={styles.statCard}>
      <div
        className={styles.statIcon}
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className={styles.statContent}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
        {sub && <p className={styles.statSub}>{sub}</p>}
      </div>
    </div>
  );
}
