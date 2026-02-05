const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://spendwise-backend-0zlx.onrender.com/api');
console.log('SpendWise API Config:', { isLocal, API_URL });

export default API_URL;
