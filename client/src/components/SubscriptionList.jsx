import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import { getMockSubscriptions, addMockSubscription, deleteMockSubscription } from '../mockData';

const SubscriptionList = ({ updateTrigger, onChange }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [form, setForm] = useState({ name: '', amount: '', billingCycle: 'monthly', nextPaymentDate: '' });
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchSubscriptions();
    }, [updateTrigger, user]);

    const fetchSubscriptions = async () => {
        if (user.token === 'mock-token') {
            setSubscriptions(getMockSubscriptions());
            return;
        }
        try {
            const res = await fetch(`${API_URL}/subscriptions`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch subscriptions');
            const data = await res.json();
            setSubscriptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (user.token === 'mock-token') {
            deleteMockSubscription(id);
            setSubscriptions(getMockSubscriptions());
            onChange();
            return;
        }
        try {
            await fetch(`${API_URL}/subscriptions/${id}`, {
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
        if (user.token === 'mock-token') {
            addMockSubscription(form);
            setSubscriptions(getMockSubscriptions());
            setForm({ name: '', amount: '', billingCycle: 'monthly', nextPaymentDate: '' });
            onChange();
            return;
        }
        try {
            await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(form),
            });
            setForm({ name: '', amount: '', billingCycle: 'monthly', nextPaymentDate: '' });
            onChange();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-2">🔄</span> Subscriptions
            </h2>

            {/* Add Form */}
            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-purple-300 outline-none transition"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-purple-300 outline-none transition"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                    <select
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-purple-300 outline-none transition"
                        value={form.billingCycle}
                        onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <input
                        type="date"
                        className="p-2 border rounded w-full focus:ring-2 focus:ring-purple-300 outline-none transition"
                        value={form.nextPaymentDate}
                        onChange={(e) => setForm({ ...form, nextPaymentDate: e.target.value })}
                    />
                </div>
                <button type="submit" className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold shadow-md">
                    Add Subscription
                </button>
            </form>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {subscriptions.map((sub) => (
                    <div key={sub._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border-l-4 border-purple-400">
                        <div>
                            <p className="font-semibold text-gray-800">{sub.name}</p>
                            <p className="text-xs text-gray-500">
                                {sub.billingCycle} • Next: {sub.nextPaymentDate ? new Date(sub.nextPaymentDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-700">R{sub.amount}</span>
                            <button onClick={() => handleDelete(sub._id)} className="text-red-500 hover:text-red-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {subscriptions.length === 0 && <p className="text-center text-gray-400 py-4">No subscriptions yet.</p>}
            </div>
        </div>
    );
};

export default SubscriptionList;
