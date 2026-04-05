import React, { useState, useEffect } from "react";

const Transactions = ({ role, transactions, setTransactions, dark }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    category: "",
    type: "expense",
    amount: "",
  });

  useEffect(() => {
    if (role !== "admin") setShowForm(false);
  }, [role]);

  const handleAdd = () => {
    if (role !== "admin") return;

    if (!formData.date || !formData.category || !formData.amount) return;

    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
    };

    setTransactions([newTransaction, ...transactions]);

    setFormData({
      date: "",
      category: "",
      type: "expense",
      amount: "",
    });

    setShowForm(false);
  };

  const filteredData = transactions
    .filter((t) =>
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      typeFilter === "all" ? true : t.type === typeFilter
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  return (
    <div>
     

      {/* ADD BUTTON */}
      {role === "admin" && (
        <button
          style={{
            ...styles.addBtn,
            background: dark ? "#16a34a" : "#4CAF50",
          }}
          onClick={() => setShowForm(!showForm)}
        >
          + Add Transaction
        </button>
      )}

      {/* FORM */}
      {role === "admin" && showForm && (
        <div style={styles.form}>
          {["date", "category", "amount"].map((field) => (
            <input
              key={field}
              type={field === "date" ? "date" : field === "amount" ? "number" : "text"}
              placeholder={field}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              style={inputStyle(dark)}
            />
          ))}

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            style={inputStyle(dark)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button style={styles.saveBtn} onClick={handleAdd}>
            Save
          </button>
        </div>
      )}

      {/* FILTERS */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle(dark)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={inputStyle(dark)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={inputStyle(dark)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* TABLE */}
      <div
        style={{
          ...styles.tableContainer,
          background: dark ? "#1f2937" : "#fff",
        }}
      >
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                background: dark ? "#374151" : "#f1f5f9",
                color: dark ? "#fff" : "#000",
              }}
            >
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((t) => (
              <tr
                key={t.id}
                style={{
                  ...styles.row,
                  color: dark ? "#ddd" : "#000",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = dark
                    ? "#374151"
                    : "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={styles.td}>{t.date}</td>
                <td style={styles.td}>{t.category}</td>
                <td
                  style={{
                    ...styles.td,
                    color:
                      t.type === "income" ? "#22c55e" : "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  {t.type}
                </td>
                <td style={styles.td}>
                  ₹ {t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = (dark) => ({
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: dark ? "#374151" : "#fff",
  color: dark ? "#fff" : "#000",
});

const styles = {
  addBtn: {
    marginBottom: "15px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  tableContainer: {
    borderRadius: "12px",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderTop: "1px solid #374151",
  },

  row: {
    transition: "0.2s",
    cursor: "pointer",
  },
};

export default Transactions;