// const fetch = require('node-fetch'); // Native fetch in Node 18+

const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
};

/* 
 * Simple test runner
 */
async function runTests() {
    console.log('🚀 Starting System Check...\n');

    try {
        // 1. Register
        console.log('1. Testing Registration...');
        let res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`Registration failed: ${err.message}`);
        }
        const user = await res.json();
        console.log('✅ Registration Successful:', user.email);
        const token = user.token;

        // 2. Login (Redundant but good to check)
        console.log('\n2. Testing Login...');
        res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        });
        if (!res.ok) throw new Error('Login failed');
        console.log('✅ Login Successful');

        // 3. Add Expense
        console.log('\n3. Testing Add Expense...');
        res = await fetch(`${BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Expense',
                amount: 50,
                category: 'Testing'
            })
        });
        if (!res.ok) throw new Error('Add Expense failed');
        const expense = await res.json();
        console.log('✅ Expense Added:', expense.title);

        // 4. Verify Expense List
        console.log('\n4. Verifying Expense persisted...');
        res = await fetch(`${BASE_URL}/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const expenses = await res.json();
        if (expenses.length !== 1 || expenses[0]._id !== expense._id) {
            throw new Error('Expense persistence check failed');
        }
        console.log('✅ Expense Verified in List');

        // 5. Delete Expense
        console.log('\n5. Testing Delete Expense...');
        res = await fetch(`${BASE_URL}/expenses/${expense._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Delete failed');
        console.log('✅ Expense Deleted');

        // 6. Verify Empty
        res = await fetch(`${BASE_URL}/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const remaining = await res.json();
        if (remaining.length !== 0) throw new Error('Delete persistence check failed');
        console.log('✅ List is now empty');

        console.log('\n✨ ALL SYSTEMS OPERATIONAL ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

runTests();
