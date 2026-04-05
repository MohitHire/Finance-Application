import React from "react";

const Header = ({ selected, role, setRole, dark, setDark }) => {
  return (
    <div
      style={{
        ...styles.header,
        background: dark ? "#1f2937" : "#fff",
        color: dark ? "#fff" : "#000",
      }}
    >
      {/* PAGE TITLE */}
      <h2 style={{ margin: 0 }}>{selected}</h2>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {/* DARK MODE TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          style={styles.iconBtn}
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
          }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        {/* USER */}
        <div style={styles.user}>
          <div style={styles.avatar}>U</div>
          <span>User</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #374151",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  iconBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  select: {
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#4CAF50",
    color: "#fff",
  },

  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#2e7d32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};

export default Header;