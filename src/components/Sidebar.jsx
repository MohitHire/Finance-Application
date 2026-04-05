import React from "react";

const Sidebar = ({ selected, setSelected, dark }) => {
  const menuItems = ["Dashboard", "Transactions", "Insights"];

  return (
    <div
      style={{
        ...styles.sidebar,
        backgroundColor: dark ? "#1f2937" : "#ffffff",
        borderRight: dark ? "1px solid #374151" : "1px solid #ddd",
        color: dark ? "#fff" : "#000",
      }}
    >
      <h2 style={styles.logo}>💰 Finance</h2>

      {menuItems.map((item) => (
        <div
          key={item}
          onClick={() => setSelected(item)}
          style={{
            ...styles.menuItem,
            backgroundColor:
              selected === item
                ? "#4CAF50"
                : "transparent",
            color:
              selected === item
                ? "#fff"
                : dark
                ? "#ccc"
                : "#333",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    padding: "20px",
    boxSizing: "border-box",
  },

  logo: {
    marginBottom: "30px",
  },

  menuItem: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default Sidebar;