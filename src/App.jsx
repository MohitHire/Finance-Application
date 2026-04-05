import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { transactions as initialData } from "./data/transactiondata";

function App() {
  const [selected, setSelected] = useState("Dashboard");
  
  const [role, setRole] = useState("admin"); 
  const [dark, setDark] = useState(false);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  
  const clearData = () => {
    if (window.confirm("Reset all transactions to default?")) {
      localStorage.removeItem("transactions");
      setTransactions(initialData);
    }
  };

  return (
    <div
      style={{
        ...styles.app,
        backgroundColor: dark ? "#111827" : "#f5f7fb",
        color: dark ? "#fff" : "#000",
      }}
    >
      <Sidebar selected={selected} setSelected={setSelected} dark={dark} />

      <div style={styles.main}>
        <Header
          selected={selected}
          role={role}
          setRole={setRole}
          dark={dark}
          setDark={setDark}
          clearData={clearData} // Passing this to Header
        />

        <div style={styles.content}>
          {selected === "Dashboard" && (
            <Dashboard transactions={transactions} dark={dark}/>
          )}
          {selected === "Transactions" && (
            <Transactions
              role={role}
              transactions={transactions}
              setTransactions={setTransactions}
              dark={dark}
            />
          )}
          {selected === "Insights" && (
            <Insights transactions={transactions} dark={dark} />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  main: {
    flex: 1,
  },
  content: {
    padding: "20px",
  },
};

export default App;