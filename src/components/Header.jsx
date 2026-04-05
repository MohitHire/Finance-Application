import React from "react";

const Header = ({ selected, role, setRole, dark, setDark, userName = "User" }) => {
  // Dynamic styles based on theme
  const themeStyles = {
    background: dark ? "#111827" : "#ffffff",
    color: dark ? "#f9fafb" : "#111827",
    borderBottom: dark ? "1px solid #374151" : "1px solid #e5e7eb",
    boxShadow: dark ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  };

  return (
    <header style={{ ...styles.header, ...themeStyles }}>
      {/* PAGE TITLE */}
      <h2 style={styles.title}>{selected}</h2>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {/* DARK MODE TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          style={{ ...styles.iconBtn, background: dark ? "#374151" : "#f3f4f6" }}
          aria-label="Toggle Dark Mode"
        >
          {dark ? "🌙" : "☀️"}
        </button>

        {/* ROLE SWITCH */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            ...styles.select,
            background: dark ? "#374151" : "#fff",
            color: dark ? "#fff" : "#000",
            borderColor: dark ? "#4b5563" : "#d1d5db",
          }}
        >
          
          
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        {/* USER PROFILE */}
        <div style={styles.user}>
          <div style={styles.avatar}>{userName.charAt(0)}</div>
          <span style={styles.userName}>{userName}</span>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    transition: "all 0.3s ease",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "700",
    letterSpacing: "-0.025em",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconBtn: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid",
    cursor: "pointer",
    outline: "none",
    fontWeight: "500",
  },
  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "4px 12px 4px 6px",
    borderRadius: "30px",
    background: "#10b981", // More modern Emerald green
    color: "#fff",
    cursor: "default",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  userName: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
};

export default Header;