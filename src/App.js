import React, { useState, useContext, createContext, useEffect } from 'react';
import { Chart, registerables } from 'chart.js'; 
import { Chart as ChartJS } from 'react-chartjs-2'; 
import './App.css';


Chart.register(...registerables);

const ExpenseContext = createContext();

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', description: '', date: '', category: '', paymentMethod: 'cash' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [filters, setFilters] = useState({ category: '', dateRange: [], paymentMethod: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const addExpense = () => {
    setExpenses([...expenses, { ...formData, id: Date.now() }]);
    setFormData({ amount: '', description: '', date: '', category: '', paymentMethod: 'cash' });
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filters.category ? expense.category === filters.category : true;
    const matchesPaymentMethod = filters.paymentMethod ? expense.paymentMethod === filters.paymentMethod : true;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPaymentMethod && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const totalExpenses = sortedExpenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryExpenses),
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
    ],
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense }}>
      <div className="app p-6">
        <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>
        <div className="expense-form mb-6">
          <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="border p-2 mr-2" />
          <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="border p-2 mr-2" />
          <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="border p-2 mr-2" />
          <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border p-2 mr-2" />
          <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="border p-2 mr-2">
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
          </select>
          <button onClick={addExpense} className="bg-blue-500 text-white p-2">Add Expense</button>
        </div>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border p-2 mb-4" />
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="cursor-pointer">Date</th>
              <th onClick={() => setSortConfig({ key: 'description', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="cursor-pointer">Description</th>
              <th onClick={() => setSortConfig({ key: 'amount', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="cursor-pointer">Amount</th>
              <th onClick={() => setSortConfig({ key: 'category', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="cursor-pointer">Category</th>
              <th onClick={() => setSortConfig({ key: 'paymentMethod', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="cursor-pointer">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>${expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Total Expenses: ${totalExpenses}</h2>
          <ChartJS type="pie" data={chartData} />
        </div>
      </div>
    </ExpenseContext.Provider>
  );
};

export default App;
