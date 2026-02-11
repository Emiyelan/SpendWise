export const MOCK_EXPENSES = [
    { _id: '1', title: 'Groceries', amount: 1250.00, category: 'Food', date: new Date().toISOString() },
    { _id: '2', title: 'Uber', amount: 150.00, category: 'Transport', date: new Date().toISOString() },
    { _id: '3', title: 'Internet', amount: 899.00, category: 'Utilities', date: new Date().toISOString() },
    { _id: '4', title: 'Coffee', amount: 45.00, category: 'Food', date: new Date().toISOString() },
];

export const MOCK_SUBSCRIPTIONS = [
    { _id: '1', name: 'Netflix', amount: 199.00, billingCycle: 'monthly', nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { _id: '2', name: 'Spotify', amount: 60.00, billingCycle: 'monthly', nextPaymentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
];
