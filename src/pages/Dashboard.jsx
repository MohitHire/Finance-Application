import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = ({ transactions, dark }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const balance = income - expenses;

  const lineData = transactions.map((t) => ({
    date: t.date,
    amount: t.amount,
  }));

  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryMap).map((k) => ({
    name: k,
    value: categoryMap[k],
  }));

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  return (
    <div>
      {/* CARDS */}
      <div style={styles.grid}>
        {[
          { title: "Total Balance", value: balance, bg: "#3b82f6" },
          { title: "Income", value: income, bg: "#16a34a" },
          { title: "Expenses", value: expenses, bg: "#dc2626" },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              ...styles.card,
              background: dark ? "#1f2937" : "#fff",
              color: dark ? "#fff" : "#000",
            }}
          >
            <h4>{c.title}</h4>
            <p style={styles.amount}>
              ₹ {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={styles.grid}>
        <div
          style={{
            ...styles.chart,
            background: dark ? "#1f2937" : "#fff",
            color: dark ? "#fff" : "#000",
          }}
        >
          <h4>Balance Trend</h4>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis stroke={dark ? "#ccc" : "#000"} dataKey="date" />
              <YAxis stroke={dark ? "#ccc" : "#000"} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4CAF50"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            ...styles.chart,
            background: dark ? "#1f2937" : "#fff",
          }}
        >
          <h4>Spending Breakdown</h4>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
  },
  amount: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  chart: {
    padding: "20px",
    borderRadius: "12px",
  },
};

export default Dashboard;