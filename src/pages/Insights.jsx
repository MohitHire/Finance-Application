import React from "react";

const Insights = ({ transactions, dark }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  // Category Logic
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0]?.[0];
  const topPercentage = expenses > 0 ? Math.round((categoryMap[topCategory] / expenses) * 100) : 0;

  // Financial Health Messaging
  const getStatusMessage = () => {
    if (savingsRate >= 20) return { icon: "🚀", text: "Excellent! You're hitting the 20% savings rule." };
    if (savingsRate > 0) return { icon: "✅", text: "Good job! You're living within your means." };
    return { icon: "⚠️", text: "Warning: Your expenses are exceeding your income." };
  };

  const status = getStatusMessage();

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Core Stats */}
        <div style={card(dark)}>
          <h4 style={styles.label}>Total Income</h4>
          <p style={styles.value}>₹ {income.toLocaleString()}</p>
        </div>

        <div style={card(dark)}>
          <h4 style={styles.label}>Total Expenses</h4>
          <p style={styles.value}>₹ {expenses.toLocaleString()}</p>
        </div>

        <div style={card(dark)}>
          <h4 style={styles.label}>Net Savings</h4>
          <p style={{ ...styles.value, color: savings >= 0 ? "#22c55e" : "#ef4444" }}>
            ₹ {savings.toLocaleString()}
          </p>
        </div>

        <div style={card(dark)}>
          <h4 style={styles.label}>Savings Rate</h4>
          <p style={{ ...styles.value, color: "#3b82f6" }}>{savingsRate}%</p>
        </div>

        {/* Dynamic Insight Card */}
        <div style={{ ...card(dark), gridColumn: "span 2" }}>
          <div style={styles.flexBetween}>
            <div>
              <p style={{ fontSize: "16px", fontWeight: "600" }}>
                {status.icon} {status.text}
              </p>
              <p style={{ fontSize: "13px", opacity: 0.8, marginTop: "5px" }}>
                Your top spending is <b>{topCategory}</b>. Try to keep this under 30% of total spend.
              </p>
            </div>
          </div>
        </div>

        {/* Category Breakdown List */}
        <div style={{ ...card(dark), gridColumn: "span 2" }}>
          <h4 style={{ ...styles.label, marginBottom: "15px" }}>Category Breakdown</h4>
          {sortedCategories.length > 0 ? (
            sortedCategories.map(([cat, amt]) => (
              <div key={cat} style={styles.categoryRow}>
                <span style={{ fontSize: "14px" }}>{cat}</span>
                <div style={styles.progressContainer}>
                  <div 
                    style={{ 
                      ...styles.progressBar, 
                      width: `${Math.round((amt / expenses) * 100)}%`,
                      backgroundColor: cat === topCategory ? "#22c55e" : "#6366f1"
                    }} 
                  />
                </div>
                <span style={styles.catAmount}>₹{amt.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No expense data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const card = (dark) => ({
  background: dark ? "#1f2937" : "#fff",
  color: dark ? "#f9fafb" : "#111827",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: dark ? "none" : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  border: dark ? "1px solid #374151" : "1px solid #e5e7eb",
});

const styles = {
  container: { padding: "10px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  label: { fontSize: "14px", fontWeight: "500", opacity: 0.7, margin: "0 0 8px 0" },
  value: { fontSize: "24px", fontWeight: "bold", margin: 0 },
  flexBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  categoryRow: {
    display: "grid",
    gridTemplateColumns: "100px 1fr 80px",
    alignItems: "center",
    gap: "15px",
    marginBottom: "12px",
  },
  progressContainer: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: "4px", transition: "width 0.5s ease" },
  catAmount: { fontSize: "13px", fontWeight: "600", textAlign: "right" },
};

export default Insights;