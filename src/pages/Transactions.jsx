import React, { useState } from "react";

const Transactions = ({ role, transactions, setTransactions, dark }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today
    category: "",
    type: "expense",
    amount: "",
  });

  const handleSave = () => {
    if (role !== "admin") {
      alert("Switch to Admin role to add data.");
      return;
    }
    
    if (!formData.category || !formData.amount) {
      alert("Please fill in the Category and Amount.");
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      // Fallback to today if date is empty
      date: formData.date || new Date().toISOString().split('T')[0] 
    };

    if (editingId) {
      setTransactions(transactions.map(t => 
        t.id === editingId ? { ...transactionData, id: editingId } : t
      ));
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        ...transactionData,
      };
      setTransactions([newTransaction, ...transactions]);
    }

    // Reset Form
    setFormData({ 
      date: new Date().toISOString().split('T')[0], 
      category: "", 
      type: "expense", 
      amount: "" 
    });
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setFormData(t);
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = ["Date,Category,Type,Amount"];
    const rows = filteredData.map(t => `${t.date},${t.category},${t.type},${t.amount}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finance_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredData = transactions
    .filter((t) => t.category.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
    .sort((a, b) =>
      sortOrder === "latest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const theme = {
    bg: dark ? "#1f2937" : "#fff",
    text: dark ? "#fff" : "#111827",
    border: dark ? "#374151" : "#e5e7eb",
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={styles.header}>
        {role === "admin" && (
          <button
            style={{ ...styles.addBtn, background: "#4CAF50" }}
            onClick={() => { 
                setShowForm(!showForm); 
                setEditingId(null);
                if(!showForm) setFormData({ date: new Date().toISOString().split('T')[0], category: "", type: "expense", amount: "" });
            }}
          >
            {showForm ? "Cancel" : "+ Add Transaction"}
          </button>
        )}
        <button style={styles.exportBtn} onClick={exportCSV}>Export CSV</button>
      </div>

      {showForm && role === "admin" && (
        <div style={{ ...styles.form, background: theme.bg, border: `1px solid ${theme.border}`, padding: '15px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: theme.text }}>{editingId ? "Edit Transaction" : "New Entry"}</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={inputStyle(dark)} />
            <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle(dark)} />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} style={inputStyle(dark)} />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={inputStyle(dark)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button style={styles.saveBtn} onClick={handleSave}>{editingId ? "Update" : "Save"}</button>
          </div>
        </div>
      )}

      <div style={styles.controls}>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} style={{ ...inputStyle(dark), flex: 2 }} />
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={inputStyle(dark)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle(dark)}>
          <option value="latest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div style={{ ...styles.tableContainer, background: theme.bg, border: `1px solid ${theme.border}` }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: dark ? "#111827" : "#f8fafc", color: theme.text }}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              {role === "admin" && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map((t) => (
              <tr key={t.id} style={{ ...styles.row, color: theme.text, borderTop: `1px solid ${theme.border}` }}>
                <td style={styles.td}>{t.date}</td>
                <td style={styles.td}>{t.category}</td>
                <td style={{ ...styles.td, color: t.type === "income" ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>{t.type}</td>
                <td style={styles.td}>₹{t.amount.toLocaleString()}</td>
                {role === "admin" && (
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(t)} style={styles.actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(t.id)} style={{ ...styles.actionBtn, color: "#ef4444" }}>Delete</button>
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No transactions.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={styles.pageBtn}>Prev</button>
          <span style={{ color: theme.text }}>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={styles.pageBtn}>Next</button>
        </div>
      )}
    </div>
  );
};

const inputStyle = (dark) => ({
  padding: "10px",
  borderRadius: "8px",
  border: dark ? "1px solid #4b5563" : "1px solid #cbd5e1",
  background: dark ? "#374151" : "#fff",
  color: dark ? "#fff" : "#000",
  outline: 'none'
});

const styles = {
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  addBtn: { padding: "10px 18px", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600" },
  exportBtn: { padding: "10px 18px", background: "#6366f1", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" },
  form: { marginBottom: "20px" },
  controls: { display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" },
  saveBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  tableContainer: { borderRadius: "12px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px", textAlign: "left", fontSize: "14px" },
  td: { padding: "14px" },
  row: { transition: "0.2s" },
  actionBtn: { background: "none", border: "none", color: "#3b82f6", cursor: "pointer", marginRight: "10px", fontSize: "13px", fontWeight: "600" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" },
  pageBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer", background: "#f8fafc" }
};

export default Transactions;