const INITIAL_EXPENSES = [
    { _id: '1', title: 'Groceries', amount: 1250.00, category: 'Food', date: new Date().toISOString() },
    { _id: '2', title: 'Uber', amount: 150.00, category: 'Transport', date: new Date().toISOString() },
    { _id: '3', title: 'Internet', amount: 899.00, category: 'Utilities', date: new Date().toISOString() },
    { _id: '4', title: 'Coffee', amount: 45.00, category: 'Food', date: new Date().toISOString() },
];

const INITIAL_SUBSCRIPTIONS = [
    { _id: '1', name: 'Netflix', amount: 199.00, billingCycle: 'monthly', nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { _id: '2', name: 'Spotify', amount: 60.00, billingCycle: 'monthly', nextPaymentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
];

export const getMockExpenses = () => {
    const stored = localStorage.getItem('mock_expenses');
    if (!stored) {
        localStorage.setItem('mock_expenses', JSON.stringify(INITIAL_EXPENSES));
        return INITIAL_EXPENSES;
    }
    return JSON.parse(stored);
};

export const addMockExpense = (expense) => {
    const expenses = getMockExpenses();
    const newExpense = { ...expense, _id: Date.now().toString(), date: new Date().toISOString() };
    const updated = [...expenses, newExpense];
    localStorage.setItem('mock_expenses', JSON.stringify(updated));
    return updated;
};

export const deleteMockExpense = (id) => {
    const expenses = getMockExpenses();
    const updated = expenses.filter(e => e._id !== id);
    localStorage.setItem('mock_expenses', JSON.stringify(updated));
    return updated;
};

export const getMockSubscriptions = () => {
    const stored = localStorage.getItem('mock_subscriptions');
    if (!stored) {
        localStorage.setItem('mock_subscriptions', JSON.stringify(INITIAL_SUBSCRIPTIONS));
        return INITIAL_SUBSCRIPTIONS;
    }
    return JSON.parse(stored);
};

export const addMockSubscription = (subscription) => {
    const subs = getMockSubscriptions();
    const newSub = { ...subscription, _id: Date.now().toString() };
    const updated = [...subs, newSub];
    localStorage.setItem('mock_subscriptions', JSON.stringify(updated));
    return updated;
};

export const deleteMockSubscription = (id) => {
    const subs = getMockSubscriptions();
    const updated = subs.filter(s => s._id !== id);
    localStorage.setItem('mock_subscriptions', JSON.stringify(updated));
    return updated;
};
