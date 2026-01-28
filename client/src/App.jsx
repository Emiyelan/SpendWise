import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import ExpenseList from './components/ExpenseList'
import SubscriptionList from './components/SubscriptionList'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const Home = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { logout, user } = useAuth();

  const triggerUpdate = () => setUpdateTrigger(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight">SpendWise</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hello, {user.username}</span>
            <button onClick={logout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Logout</button>
          </div>
        </div>

        <Dashboard updateTrigger={updateTrigger} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ExpenseList updateTrigger={updateTrigger} onChange={triggerUpdate} />
          <SubscriptionList updateTrigger={updateTrigger} onChange={triggerUpdate} />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
