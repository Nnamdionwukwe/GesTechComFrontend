// src/components/admin/AnalyticsManagement.jsx
import { useState, useEffect } from "react";
import {
  Eye,
  Users,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  RefreshCw,
  Calendar,
} from "lucide-react";
import styles from "./AnalyticsManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

function fmt(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function pct(a, b) {
  if (!b) return "0%";
  return ((a / b) * 100).toFixed(1) + "%";
}

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = "#3498db" }) {
  if (!data.length) return null;
  const W = 100,
    H = 36,
    pad = 3;
  const vals = data.map((d) => Number(d.visits || d.count || 0));
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = pad + (i / Math.max(vals.length - 1, 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={styles.spark}
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, sparkData }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + "18" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className={styles.statBody}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
        {sub && <p className={styles.statSub}>{sub}</p>}
      </div>
      {sparkData && <Sparkline data={sparkData} color={color} />}
    </div>
  );
}

// ── Bar Row ───────────────────────────────────────────────────────────────────
function BarRow({ label, count, total, color = "#3498db" }) {
  const w = total ? `${Math.min((count / total) * 100, 100)}%` : "0%";
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel} title={label}>
        {label}
      </span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: w, background: color }}
        />
      </div>
      <span className={styles.barCount}>{fmt(count)}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnalyticsManagement() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshed, setRefreshed] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/analytics?days=${range}`, {
        headers,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setRefreshed(new Date());
    } catch (e) {
      setError("Could not load analytics: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  return (
    <div className={styles.wrap}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.ranges}>
          <Calendar size={15} className={styles.calIcon} />
          {RANGES.map((r) => (
            <button
              key={r.value}
              className={`${styles.rangeBtn} ${range === r.value ? styles.active : ""}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className={styles.refreshBtn} onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? styles.spin : ""} />
          {refreshed && (
            <span className={styles.ts}>
              {refreshed.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading && (
        <div className={styles.skeletons}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── Stat Cards ── */}
          <div className={styles.statGrid}>
            <StatCard
              icon={Eye}
              label="Total Page Views"
              value={fmt(data.summary?.total_visits)}
              sub={`${fmt(data.summary?.today_visits)} today`}
              color="#3498db"
              sparkData={data.daily}
            />
            <StatCard
              icon={Users}
              label="Unique Visitors"
              value={fmt(data.summary?.unique_visitors)}
              sub={`${pct(data.summary?.unique_visitors, data.summary?.total_visits)} of all views`}
              color="#27ae60"
              sparkData={data.daily}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg. Daily Views"
              value={fmt(Math.round((data.summary?.total_visits || 0) / range))}
              sub={`Over ${range} days`}
              color="#f39c12"
            />
            <StatCard
              icon={Globe}
              label="Top Page"
              value={data.topPages?.[0]?.path || "—"}
              sub={`${fmt(data.topPages?.[0]?.visits)} visits`}
              color="#9b59b6"
            />
          </div>

          {/* ── Charts Row ── */}
          <div className={styles.chartsRow}>
            {/* Daily bar chart */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Daily Traffic</h3>
              <div className={styles.dailyChart}>
                {(data.daily || []).map((d, i) => {
                  const maxV = Math.max(
                    ...(data.daily || []).map((x) => x.visits),
                    1,
                  );
                  const h = Math.max((d.visits / maxV) * 110, 3);
                  const showLabel =
                    i % Math.ceil((data.daily || []).length / 6) === 0;
                  return (
                    <div
                      key={i}
                      className={styles.barCol}
                      title={`${d.day}: ${d.visits}`}
                    >
                      <div
                        className={styles.barColFill}
                        style={{ height: h }}
                      />
                      {showLabel && (
                        <span className={styles.dayLabel}>
                          {new Date(d.day).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top pages */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Top Pages</h3>
              <div className={styles.barList}>
                {(data.topPages || []).slice(0, 8).map((p, i) => (
                  <BarRow
                    key={i}
                    label={p.path}
                    count={p.visits}
                    total={data.summary?.total_visits}
                    color="#3498db"
                  />
                ))}
                {!data.topPages?.length && (
                  <p className={styles.empty}>No data yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom Row ── */}
          <div className={styles.bottomRow}>
            {/* Sources */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Traffic Sources</h3>
              <div className={styles.barList}>
                {(data.referrers || []).slice(0, 6).map((r, i) => (
                  <BarRow
                    key={i}
                    label={r.referrer || "Direct / None"}
                    count={r.visits}
                    total={data.summary?.total_visits}
                    color="#27ae60"
                  />
                ))}
                {!data.referrers?.length && (
                  <p className={styles.empty}>No referrer data yet.</p>
                )}
              </div>
            </div>

            {/* Devices */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Devices</h3>
              <div className={styles.deviceRow}>
                {[
                  {
                    icon: Monitor,
                    key: "desktop",
                    color: "#3498db",
                    label: "Desktop",
                  },
                  {
                    icon: Smartphone,
                    key: "mobile",
                    color: "#e74c3c",
                    label: "Mobile",
                  },
                  {
                    icon: Monitor,
                    key: "tablet",
                    color: "#f39c12",
                    label: "Tablet",
                  },
                ].map(({ icon: Icon, key, color, label }) => (
                  <div key={key} className={styles.deviceItem}>
                    <Icon size={24} style={{ color }} />
                    <p className={styles.deviceVal}>
                      {fmt(data.devices?.[key] || 0)}
                    </p>
                    <p className={styles.deviceLabel}>{label}</p>
                  </div>
                ))}
              </div>
              <div className={styles.barList} style={{ marginTop: 14 }}>
                {[
                  { key: "desktop", color: "#3498db", label: "Desktop" },
                  { key: "mobile", color: "#e74c3c", label: "Mobile" },
                  { key: "tablet", color: "#f39c12", label: "Tablet" },
                ].map(({ key, color, label }) => (
                  <BarRow
                    key={key}
                    label={label}
                    count={data.devices?.[key] || 0}
                    total={data.summary?.total_visits}
                    color={color}
                  />
                ))}
              </div>
            </div>

            {/* Recent visits */}
            <div className={`${styles.card} ${styles.wideCard}`}>
              <h3 className={styles.cardTitle}>Recent Visits</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Source</th>
                      <th>Device</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.recent || []).map((r, i) => (
                      <tr key={i}>
                        <td className={styles.pathCell}>{r.path}</td>
                        <td className={styles.refCell}>{r.referrer || "—"}</td>
                        <td>{r.device || "—"}</td>
                        <td className={styles.timeCell}>
                          {new Date(r.created_at).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                    {!data.recent?.length && (
                      <tr>
                        <td colSpan={4} className={styles.empty}>
                          No visits recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
