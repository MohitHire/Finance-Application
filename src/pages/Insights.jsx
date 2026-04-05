import React from "react";

const Insights = ({ transactions, dark }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const savings = income - expenses;

  // Category breakdown
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    });

  const topCategory = Object.keys(categoryMap).reduce(
    (a, b) => (categoryMap[a] > categoryMap[b] ? a : b),
    Object.keys(categoryMap)[0]
  );

  const totalExpense = Object.values(categoryMap).reduce(
    (a, b) => a + b,
    0
  );

  const topPercentage = topCategory
    ? Math.round((categoryMap[topCategory] / totalExpense) * 100)
    : 0;

  return (
    <div>
      

      <div style={styles.grid}>
        {/* TOTAL INCOME */}
        <div style={card(dark)}>
          <h4>Total Income</h4>
          <p style={styles.value}>₹ {income.toLocaleString()}</p>
        </div>

        {/* TOTAL EXPENSE */}
        <div style={card(dark)}>
          <h4>Total Expenses</h4>
          <p style={styles.value}>₹ {expenses.toLocaleString()}</p>
        </div>

        {/* SAVINGS */}
        <div style={card(dark)}>
          <h4>Net Savings</h4>
          <p
            style={{
              ...styles.value,
              color: savings >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            ₹ {savings.toLocaleString()}
          </p>
        </div>

        {/* TOP CATEGORY */}
        <div style={card(dark)}>
          <h4>Top Spending Category</h4>
          {topCategory ? (
            <p style={styles.value}>
              {topCategory} ({topPercentage}%)
            </p>
          ) : (
            <p>No data</p>
          )}
        </div>

        {/* SMART INSIGHT */}
        <div style={{ ...card(dark), gridColumn: "span 2" }}>
          {topCategory ? (
            <p style={{ fontSize: "15px" }}>
              You spend most on{" "}
              <b>{topCategory}</b> which accounts for{" "}
              <b>{topPercentage}%</b> of your expenses.
            </p>
          ) : (
            "Not enough data"
          )}
        </div>

        {/* FINANCIAL HEALTH */}
        <div style={{ ...card(dark), gridColumn: "span 2" }}>
          <p style={{ fontSize: "15px" }}>
            {savings > 0
              ? "✅ Good job! You are saving money."
              : "⚠️ You are spending more than you earn."}
          </p>
        </div>
      </div>
    </div>
  );
};

const card = (dark) => ({
  background: dark ? "#1f2937" : "#fff",
  color: dark ? "#fff" : "#000",
  padding: "20px",
  borderRadius: "12px",
  transition: "0.3s",
});

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },
  value: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Insights;