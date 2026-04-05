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
  CartesianGrid,
} from "recharts";

const Dashboard = ({ transactions = [], dark }) => {
  
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const balance = income - expenses;

  // 2. Transform data for Line Chart (Group by Date + Sort)
  const dailyData = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = 0;
    
    acc[date] += t.type === "income" ? t.amount : -t.amount;
    return acc;
  }, {});

  const lineData = Object.keys(dailyData)
    .map((date) => ({
      date,
      amount: dailyData[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Keep timeline chronological

 
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryMap).map((k) => ({
    name: k,
    value: categoryMap[k],
  }));

  const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

  const themeStyles = {
    cardBg: dark ? "#1f2937" : "#ffffff",
    textColor: dark ? "#f3f4f6" : "#111827",
    subText: dark ? "#9ca3af" : "#6b7280",
    border: dark ? "1px solid #374151" : "1px solid #e5e7eb",
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.grid}>
        {[
          { title: "Total Balance", value: balance, color: "#3b82f6" },
          { title: "Income", value: income, color: "#16a34a" },
          { title: "Expenses", value: expenses, color: "#dc2626" },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              ...styles.card,
              background: themeStyles.cardBg,
              color: themeStyles.textColor,
              borderLeft: `5px solid ${c.color}`,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          >
            <span style={{ ...styles.cardTitle, color: themeStyles.subText }}>{c.title}</span>
            <p style={styles.amount}>₹ {c.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div style={styles.chartGrid}>
       
        <div style={{ ...styles.chartCard, background: themeStyles.cardBg, color: themeStyles.textColor }}>
          <h4 style={styles.sectionTitle}>Daily Net Flow</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#f0f0f0"} />
              <XAxis dataKey="date" stroke={themeStyles.subText} fontSize={10} />
              <YAxis stroke={themeStyles.subText} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: themeStyles.cardBg, border: themeStyles.border }}
                itemStyle={{ color: themeStyles.textColor }}
              />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        
        <div style={{ ...styles.chartCard, background: themeStyles.cardBg, color: themeStyles.textColor }}>
          <h4 style={styles.sectionTitle}>Spending Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={60} paddingAngle={5}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartGrid}>
       
        <div style={{ ...styles.chartCard, background: themeStyles.cardBg, color: themeStyles.textColor }}>
          <h4 style={styles.sectionTitle}>Recent Activity</h4>
          <div style={styles.listContainer}>
            {transactions.slice(-4).reverse().map((t, i) => (
              <div key={i} style={{ ...styles.listItem, borderBottom: themeStyles.border }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{t.category}</div>
                  <div style={{ fontSize: "12px", color: themeStyles.subText }}>{t.date}</div>
                </div>
                <div style={{ fontWeight: "bold", color: t.type === "expense" ? "#dc2626" : "#16a34a" }}>
                  {t.type === "expense" ? "-" : "+"} ₹{t.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div style={{ ...styles.chartCard, background: themeStyles.cardBg, color: themeStyles.textColor }}>
          <h4 style={styles.sectionTitle}>Monthly Budget</h4>
          <div style={{ marginTop: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px' }}>Limit: ₹10,000</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{Math.min(((expenses / 10000) * 100), 100).toFixed(0)}%</span>
             </div>
             <div style={styles.progressBarContainer}>
                <div style={{ 
                    ...styles.progressBar, 
                    width: `${Math.min((expenses / 10000) * 100, 100)}%`,
                    backgroundColor: expenses > 8000 ? '#dc2626' : '#16a34a' 
                }} />
             </div>
             <p style={{ fontSize: '12px', color: themeStyles.subText, marginTop: '10px' }}>
                {expenses > 10000 ? "⚠️ You have exceeded your budget!" : "Keep it up! You're within your limit."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "25px" },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "25px" },
  card: { padding: "24px", borderRadius: "16px" },
  cardTitle: { fontSize: "14px", fontWeight: "600", textTransform: "uppercase" },
  amount: { fontSize: "28px", fontWeight: "800", margin: "10px 0 0 0" },
  chartCard: { padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  sectionTitle: { margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700" },
  listContainer: { display: "flex", flexDirection: "column" },
  listItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" },
  progressBarContainer: { width: '100%', height: '10px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', transition: 'width 0.5s ease-in-out' }
};

export default Dashboard;