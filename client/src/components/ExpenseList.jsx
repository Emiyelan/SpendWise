import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const ExpenseList = ({ updateTrigger, onChange }) => {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ title: '', amount: '', category: '' });
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchExpenses();
    }, [updateTrigger, user]);

    const fetchExpenses = async () => {
        try {
            const res = await fetch(`${API_URL}/expenses`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` },
            });
            onChange();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(form),
            });
            setForm({ title: '', amount: '', category: '' });
            onChange();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-2">💸</span> Expenses
            </h2>

            {/* Add Form */}
            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none transition"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none transition"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        className="p-2 border rounded w-full md:col-span-2 focus:ring-2 focus:ring-indigo-300 outline-none transition"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md">
                    Add Expense
                </button>
            </form>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {expenses.map((expense) => (
                    <div key={expense._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border-l-4 border-indigo-400">
                        <div>
                            <p className="font-semibold text-gray-800">{expense.title}</p>
                            <p className="text-xs text-gray-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-700">R{expense.amount}</span>
                            <button onClick={() => handleDelete(expense._id)} className="text-red-500 hover:text-red-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {expenses.length === 0 && <p className="text-center text-gray-400 py-4">No expenses yet.</p>}
            </div>
        </div>
    );
};

export default ExpenseList;
