import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, History, TrendingUp, Wallet, Target, Calendar, DollarSign, Edit, Trash2, Save } from 'lucide-react';

const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', category: 'Salary', amount: 50000, date: '2025-08-01', description: 'Monthly salary' },
    { id: 2, type: 'expense', category: 'Travel', amount: 2500, date: '2025-08-02', description: 'Bus tickets' },
    { id: 3, type: 'expense', category: 'Utilities', amount: 1200, date: '2025-08-02', description: 'Electricity bill' },
    { id: 4, type: 'expense', category: 'Food', amount: 800, date: '2025-08-03', description: 'Restaurant' },
    { id: 5, type: 'expense', category: 'Groceries', amount: 3500, date: '2025-08-03', description: 'Weekly shopping' },
    { id: 6, type: 'expense', category: 'Entertainment', amount: 1500, date: '2025-08-04', description: 'Movie tickets' },
    { id: 7, type: 'expense', category: 'Healthcare', amount: 900, date: '2025-08-04', description: 'Medical checkup' }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [budget] = useState({
    monthly: 45000,
    categories: {
      Travel: 3000,
      Food: 2500,
      Groceries: 5000,
      Utilities: 2000,
      Entertainment: 2000,
      Healthcare: 1500
    }
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data with enhanced information
  const incomeData = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  // Chart colors
  const incomeColors = ['#10B981', '#059669', '#047857', '#065F46'];
  const expenseColors = ['#EF4444', '#DC2626', '#B91C1C', '#F97316', '#F59E0B', '#EAB308', '#84CC16'];

  // Enhanced tooltip with percentage and formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = data.payload.type === 'income' ? totalIncome : totalExpense;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 transform transition-all duration-200">
          <p className="font-bold text-gray-800 text-lg">{data.name}</p>
          <p className="text-blue-600 font-semibold text-xl">₹{data.value.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">{percentage}% of total</p>
          <div className="mt-2 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  // Add/Edit transaction functions
  const addTransaction = () => {
    if (newTransaction.category && newTransaction.amount) {
      const transaction = {
        id: Date.now(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        type: 'expense',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  };

  const saveEditTransaction = () => {
    if (editingTransaction.category && editingTransaction.amount) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...editingTransaction, amount: parseFloat(editingTransaction.amount) }
          : t
      ));
      setEditingTransaction(null);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Budget analysis with enhanced insights
  const getBudgetStatus = (category) => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    const budgetAmount = budget.categories[category] || 0;
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    
    return {
      spent,
      budget: budgetAmount,
      remaining: budgetAmount - spent,
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  };

  // Dashboard with enhanced UI
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Enhanced Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium opacity-90">Current Balance</h2>
            <p className="text-5xl font-bold mt-2">₹{balance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <Wallet size={48} className="opacity-80" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={20} className="text-green-300" />
              <p className="text-sm opacity-90">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-green-300">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target size={20} className="text-red-300" />
              <p className="text-sm opacity-90">Total Expense</p>
            </div>
            <p className="text-2xl font-bold text-red-300">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Income Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Income Distribution</h3>
              <p className="text-gray-500">Total: ₹{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell 
                    key={`income-${index}`} 
                    fill={incomeColors[index % incomeColors.length]}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 gap-3 mt-6">
            {incomeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: incomeColors[index % incomeColors.length] }}
                  />
                  <span className="font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-green-600">₹{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <Target className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Expense Breakdown</h3>
              <p className="text-gray-500">Total: ₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell 
                    key={`expense-${index}`} 
                    fill={expenseColors[index % expenseColors.length]}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 gap-3 mt-6">
            {expenseData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: expenseColors[index % expenseColors.length] }}
                  />
                  <span className="font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-red-600">₹{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced History with edit functionality
  const renderHistory = () => (
    <div className="space-y-8">
      {/* Add Transaction Form */}
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={addTransaction}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
          <p className="text-gray-600 mt-1">{transactions.length} transactions</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              {editingTransaction?.id === transaction.id ? (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <select
                    value={editingTransaction.type}
                    onChange={(e) => setEditingTransaction({...editingTransaction, type: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    type="text"
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({...editingTransaction, amount: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({...editingTransaction, date: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editingTransaction.description}
                    onChange={(e) => setEditingTransaction({...editingTransaction, description: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditTransaction}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingTransaction(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Budget Overview (changed from Financial Planning)
  const renderBudgetOverview = () => (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Monthly Budget Overview</h3>
        
        {/* Overall Budget Progress */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Overall Monthly Budget</span>
            <span className="text-gray-600">₹{totalExpense.toLocaleString()} / ₹{budget.monthly.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                (totalExpense / budget.monthly) > 1 ? 'bg-red-500' : 
                (totalExpense / budget.monthly) > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((totalExpense / budget.monthly) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className={`font-medium ${
              (totalExpense / budget.monthly) > 1 ? 'text-red-600' : 
              (totalExpense / budget.monthly) > 0.8 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {((totalExpense / budget.monthly) * 100).toFixed(1)}% used
            </span>
            <span className="text-gray-500">
              ₹{(budget.monthly - totalExpense).toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Category Budget Breakdown */}
        <div className="grid gap-6">
          {Object.keys(budget.categories).map((category) => {
            const status = getBudgetStatus(category);
            return (
              <div key={category} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{category}</h4>
                  <span className="text-gray-600 font-medium">
                    ₹{status.spent.toLocaleString()} / ₹{status.budget.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      status.status === 'over' ? 'bg-red-500' : 
                      status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${
                    status.status === 'over' ? 'text-red-600' : 
                    status.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {status.percentage.toFixed(1)}% of budget
                  </span>
                  <span className={`text-sm font-medium ${
                    status.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status.remaining >= 0 ? 'Under' : 'Over'} by ₹{Math.abs(status.remaining).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Insights Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Savings Goal */}
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Emergency Fund Goal</h3>
          <div className="relative mb-6">
            <div className="w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="4"
                  fill="none"
                  stroke="currentColor"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeWidth="4"
                  strokeDasharray={`${Math.min((balance / 100000) * 100, 100)}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  stroke="currentColor"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {Math.round(Math.min((balance / 100000) * 100, 100))}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-lg mb-2">₹{balance.toLocaleString()} / ₹1,00,000</p>
          <p className="text-sm text-gray-500">6 months of expenses</p>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Monthly Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <div>
                <p className="font-medium text-green-800">Savings Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((balance / totalIncome) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="font-medium text-blue-800">Budget Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(100 - (totalExpense / budget.monthly) * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="text-blue-600" size={32} />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
              <div>
                <p className="font-medium text-purple-800">Daily Avg Expense</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{Math.round(totalExpense / 30).toLocaleString()}
                </p>
              </div>
              <Calendar className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Smart Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-blue-800">Save 20% Rule</p>
                <p className="text-sm text-blue-600">Target: ₹{(totalIncome * 0.2).toLocaleString()}</p>
                <p className="text-xs text-blue-500 mt-1">Current: ₹{balance.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
              <DollarSign className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-green-800">Daily Tracking</p>
                <p className="text-sm text-green-600">Monitor small expenses</p>
                <p className="text-xs text-green-500 mt-1">They add up quickly!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
              <Wallet className="text-purple-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-purple-800">Budget Review</p>
                <p className="text-sm text-purple-600">Monthly adjustments</p>
                <p className="text-xs text-purple-500 mt-1">Stay flexible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Expense Tracker Pro</h1>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">August 2025</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'history', label: 'Transaction History', icon: History },
              { id: 'budget', label: 'Budget Overview', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'budget' && renderBudgetOverview()}
      </main>
    </div>
  );
};

export default ExpenseTracker;