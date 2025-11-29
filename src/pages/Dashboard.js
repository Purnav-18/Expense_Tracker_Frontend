import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ExpenseContext } from "../context/ExpenseContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Navbar from "../components/Navbar";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const {
    expenses,
    monthlySummary,
    totalSpending,
    fetchExpenses,
    fetchMonthlySummary,
    fetchTotalSpending,
  } = useContext(ExpenseContext);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchTotalSpending();

    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    setSelectedMonth(month);
    fetchMonthlySummary(month);
  }, []);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchMonthlySummary(month);
  };

  // Filter expenses based on search & category
  const filteredExpenses = expenses
    ?.filter((exp) =>
      exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((exp) => (filterCategory ? exp.category === filterCategory : true));

  const barData = {
    labels: monthlySummary?.breakdown?.map((item) => item.category) || [],
    datasets: [
      {
        label: "Expenses by Category",
        data: monthlySummary?.breakdown?.map((item) => item.total) || [],
        backgroundColor: "#4e73df",
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels:
      expenses?.map((exp) =>
        new Date(exp.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      ) || [],
    datasets: [
      {
        label: "Daily Spending",
        data: expenses?.map((exp) => exp.amount) || [],
        borderColor: "#4e73df",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: monthlySummary?.breakdown?.map((item) => item.category) || [],
    datasets: [
      {
        data: monthlySummary?.breakdown?.map((item) => item.total) || [],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-welcome">
          Welcome, <strong>{user?.name}</strong>
        </p>

        <div className="cards-grid">
          {/* Month Selector */}
          <div className="card">
            <h3 className="card-title">Select Month</h3>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="month-input"
            />
          </div>

          {/* Total Spending */}
          <div className="card total-card">
            <h3 className="card-title">Total Spending</h3>
            <p className="total-amount">₹{totalSpending || 0}</p>
          </div>

          {/* Add Expense */}
          <div className="card">
            <h3 className="card-title">Add Expense</h3>
            <ExpenseForm />
          </div>

          {/* Your Expenses */}
          <div className="card expenses-card">
            <h3 className="card-title">Your Expenses</h3>

            {/* Search & Filter */}
            <div className="expense-filters">
              <input
                type="text"
                placeholder="Search description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {[...new Set(expenses.map((exp) => exp.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense List */}
            <div className="expenses-list-wrapper">
              <ExpenseList expenses={filteredExpenses} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <section className="charts-section">
          <div className="chart-card">
            <h3 className="chart-title">Monthly Category Breakdown</h3>
            <Bar data={barData} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Daily Spending Trend</h3>
            <Line data={lineData} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Category Distribution</h3>
            <Pie data={pieData} />
          </div>
        </section>
      </div>
    </>
  );
}
