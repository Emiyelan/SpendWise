import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ updateTrigger }) => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalSubscriptions, setTotalSubscriptions] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchExpenses();
            fetchSubscriptions();
        }
    }, [updateTrigger, user]);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            const total = data.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalExpenses(total);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/subscriptions', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            const total = data.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalSubscriptions(total);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Expenses</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">R{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Monthly Subscriptions</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">R{totalSubscriptions.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Monthly Cost</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">R{(totalExpenses + totalSubscriptions).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default Dashboard;
