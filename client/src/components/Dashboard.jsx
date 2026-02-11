import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import { getMockExpenses, getMockSubscriptions } from '../mockData';

const Dashboard = ({ updateTrigger }) => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalSubscriptions, setTotalSubscriptions] = useState(0);
    const { user, updateProfile } = useAuth();
    const [salary, setSalary] = useState(user?.salary || 0);
    const [isEditingSalary, setIsEditingSalary] = useState(false);

    useEffect(() => {
        if (user) {
            fetchExpenses();
            fetchSubscriptions();
            setSalary(user.salary || 0);
        }
    }, [updateTrigger, user]);

    const fetchExpenses = async () => {
        if (user.token === 'mock-token') {
            const total = MOCK_EXPENSES.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalExpenses(total);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/expenses`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
            const total = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.amount, 0) : 0;
            setTotalExpenses(total);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubscriptions = async () => {
        if (user.token === 'mock-token') {
            const subs = getMockSubscriptions();
            const total = subs.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalSubscriptions(total);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/subscriptions`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch subscriptions');
            const data = await res.json();
            const total = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.amount, 0) : 0;
            setTotalSubscriptions(total);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSalaryUpdate = async () => {
        if (user.token === 'mock-token') {
            updateProfile({ ...user, salary: Number(salary) });
            setIsEditingSalary(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ salary }),
            });
            const data = await res.json();
            if (res.ok) {
                updateProfile(data);
                setIsEditingSalary(false);
            }
        } catch (err) {
            console.error('Failed to update salary');
        }
    };

    const totalCost = totalExpenses + totalSubscriptions;
    const remainingBalance = salary - totalCost;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Salary Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 relative">
                <h3 className="text-gray-500 text-sm font-semibold uppercase flex justify-between">
                    Monthly Salary
                    <button
                        onClick={() => isEditingSalary ? handleSalaryUpdate() : setIsEditingSalary(true)}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                    >
                        {isEditingSalary ? 'Save' : 'Edit'}
                    </button>
                </h3>
                {isEditingSalary ? (
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="text-2xl font-bold text-gray-800 mt-2 w-full border-b-2 border-blue-300 outline-none"
                    />
                ) : (
                    <p className="text-3xl font-bold text-gray-800 mt-2">R{Number(salary).toFixed(2)}</p>
                )}
            </div>

            {/* Expenses Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Expenses</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">R{totalExpenses.toFixed(2)}</p>
            </div>

            {/* Subscriptions Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Subscriptions</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">R{totalSubscriptions.toFixed(2)}</p>
            </div>

            {/* Balance Card */}
            <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${remainingBalance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Remaining Balance</h3>
                <p className={`text-3xl font-bold mt-2 ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R{remainingBalance.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
