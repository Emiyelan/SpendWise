const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/authMiddleware');

// Expenses
router.get('/expenses', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/expenses', protect, async (req, res) => {
    const expense = new Expense({
        user: req.user.id,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/expenses/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check for user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Subscriptions
router.get('/subscriptions', protect, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id });
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/subscriptions', protect, async (req, res) => {
    const subscription = new Subscription({
        user: req.user.id,
        name: req.body.name,
        amount: req.body.amount,
        billingCycle: req.body.billingCycle,
        nextPaymentDate: req.body.nextPaymentDate,
    });

    try {
        const newSubscription = await subscription.save();
        res.status(201).json(newSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/subscriptions/:id', protect, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Check for user
        if (subscription.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Subscription.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subscription deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
