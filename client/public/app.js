// API Configuration
const API_BASE = window.location.origin + '/api';

// State Management
let state = {
    user: null,
    token: localStorage.getItem('token'),
    transactions: [],
    challenges: [],
    leaderboard: [],
    analytics: null,
    currentView: 'login'
};

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(state.token && { 'Authorization': `Bearer ${state.token}` })
        }
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred');
    }

    return response.json();
}

// Authentication Functions
async function register(username, email, password) {
    const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
    
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    return data;
}

async function login(email, password) {
    const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    return data;
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    navigateTo('login');
}

// Data Fetching Functions
async function fetchUserProfile() {
    state.user = await apiCall('/users/profile');
}

async function fetchTransactions() {
    state.transactions = await apiCall('/transactions');
}

async function fetchAnalytics() {
    state.analytics = await apiCall('/transactions/analytics');
}

async function fetchChallenges() {
    state.challenges = await apiCall('/challenges');
}

async function fetchLeaderboard() {
    state.leaderboard = await apiCall('/users/leaderboard');
}

// Transaction Functions
async function addTransaction(transaction) {
    const newTransaction = await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction)
    });
    state.transactions.unshift(newTransaction);
    await fetchAnalytics();
    await fetchUserProfile();
}

async function deleteTransaction(id) {
    await apiCall(`/transactions/${id}`, { method: 'DELETE' });
    state.transactions = state.transactions.filter(t => t._id !== id);
    await fetchAnalytics();
}

// Challenge Functions
async function generateChallenges() {
    const challenges = await apiCall('/challenges/generate', { method: 'POST' });
    state.challenges = challenges;
}

async function updateChallenge(id, updates) {
    const updated = await apiCall(`/challenges/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    const index = state.challenges.findIndex(c => c._id === id);
    if (index !== -1) {
        state.challenges[index] = updated;
    }
    await fetchUserProfile();
}

// Navigation
function navigateTo(view) {
    state.currentView = view;
    renderApp();
}

// Render Functions
function renderNav() {
    const nav = document.getElementById('nav');
    
    if (!state.user) {
        nav.innerHTML = '';
        return;
    }

    nav.innerHTML = `
        <a href="#" class="nav-link ${state.currentView === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">Dashboard</a>
        <a href="#" class="nav-link ${state.currentView === 'transactions' ? 'active' : ''}" onclick="navigateTo('transactions')">Transactions</a>
        <a href="#" class="nav-link ${state.currentView === 'challenges' ? 'active' : ''}" onclick="navigateTo('challenges')">Challenges</a>
        <a href="#" class="nav-link ${state.currentView === 'leaderboard' ? 'active' : ''}" onclick="navigateTo('leaderboard')">Leaderboard</a>
        <a href="#" class="nav-link" onclick="logout()">Logout</a>
    `;
}

function renderLoginForm() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Welcome Back!</h2>
                <div id="auth-error" class="error-message hidden"></div>
                <form id="login-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <div class="auth-toggle">
                    Don't have an account? <a href="#" onclick="navigateTo('register')">Register</a>
                </div>
            </div>
        </div>
    `;
}

function renderRegisterForm() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Create Account</h2>
                <div id="auth-error" class="error-message hidden"></div>
                <form id="register-form" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
                <div class="auth-toggle">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Login</a>
                </div>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const analytics = state.analytics || { totalIncome: 0, totalExpenses: 0, balance: 0 };
    const activeChallenges = state.challenges.filter(c => c.status === 'active').length;
    
    return `
        <div class="dashboard">
            <div class="user-info">
                <h1>Welcome back, ${state.user.username}! 👋</h1>
                <div class="user-stats">
                    <div class="stat-card">
                        <div class="stat-value">⭐ ${state.user.points}</div>
                        <div class="stat-label">Points</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">🏆 ${state.user.level}</div>
                        <div class="stat-label">Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">🎖️ ${state.user.badges?.length || 0}</div>
                        <div class="stat-label">Badges</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">🎯 ${activeChallenges}</div>
                        <div class="stat-label">Active Challenges</div>
                    </div>
                </div>
            </div>

            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-value amount-income">$${analytics.totalIncome.toFixed(2)}</div>
                    <div class="analytics-label">Total Income</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value amount-expense">$${analytics.totalExpenses.toFixed(2)}</div>
                    <div class="analytics-label">Total Expenses</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value" style="color: ${analytics.balance >= 0 ? 'var(--secondary-color)' : 'var(--danger-color)'}">
                        $${analytics.balance.toFixed(2)}
                    </div>
                    <div class="analytics-label">Net Balance</div>
                </div>
            </div>

            <div class="cards-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Recent Transactions</h3>
                        <span class="card-icon">💳</span>
                    </div>
                    ${renderRecentTransactions()}
                    <button class="btn btn-primary mt-4" onclick="navigateTo('transactions')">View All</button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Active Challenges</h3>
                        <span class="card-icon">🎯</span>
                    </div>
                    ${renderActiveChallenges()}
                    <button class="btn btn-primary mt-4" onclick="navigateTo('challenges')">View All</button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Your Badges</h3>
                        <span class="card-icon">🎖️</span>
                    </div>
                    ${renderBadges()}
                </div>
            </div>
        </div>
    `;
}

function renderRecentTransactions() {
    const recent = state.transactions.slice(0, 5);
    
    if (recent.length === 0) {
        return '<p class="text-center" style="color: var(--text-secondary);">No transactions yet</p>';
    }
    
    return recent.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-category">${t.category}</div>
                <div class="transaction-description">${t.description || 'No description'}</div>
            </div>
            <div class="transaction-amount amount-${t.type}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

function renderActiveChallenges() {
    const active = state.challenges.filter(c => c.status === 'active').slice(0, 3);
    
    if (active.length === 0) {
        return '<p class="text-center" style="color: var(--text-secondary);">No active challenges</p>';
    }
    
    return active.map(c => {
        const progress = Math.min((c.current / c.target) * 100, 100);
        return `
            <div style="margin-bottom: 16px;">
                <div style="margin-bottom: 8px;">
                    <strong>${c.title}</strong>
                    <div style="font-size: 12px; color: var(--text-secondary);">+${c.points} points</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">${c.current} / ${c.target}</div>
            </div>
        `;
    }).join('');
}

function renderBadges() {
    const badges = state.user.badges || [];
    
    if (badges.length === 0) {
        return '<p class="text-center" style="color: var(--text-secondary);">No badges earned yet</p>';
    }
    
    return `
        <div class="badges-grid">
            ${badges.map(b => `
                <div class="badge-item">
                    <div class="badge-icon">${b.icon || '🏆'}</div>
                    <div class="badge-name">${b.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTransactions() {
    return `
        <div class="dashboard">
            <h2 class="mb-4">Transactions</h2>
            
            <div class="transaction-form">
                <h3 class="mb-4">Add Transaction</h3>
                <form id="transaction-form" onsubmit="handleAddTransaction(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Type</label>
                            <select id="type" class="form-control" required>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <input type="text" id="category" class="form-control" placeholder="e.g., Food, Salary" required>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" id="amount" class="form-control" step="0.01" min="0" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" id="description" class="form-control" placeholder="Optional description">
                    </div>
                    <button type="submit" class="btn btn-primary">Add Transaction</button>
                </form>
            </div>

            <div class="transaction-list">
                <h3 class="mb-4">Transaction History</h3>
                ${state.transactions.length === 0 ? 
                    '<p class="text-center" style="color: var(--text-secondary);">No transactions yet</p>' :
                    state.transactions.map(t => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-category">${t.category}</div>
                                <div class="transaction-description">
                                    ${t.description || 'No description'} • 
                                    ${new Date(t.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div class="transaction-amount amount-${t.type}">
                                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                            </div>
                            <button class="btn btn-danger" onclick="handleDeleteTransaction('${t._id}')">Delete</button>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
}

function renderChallenges() {
    return `
        <div class="dashboard">
            <h2 class="mb-4">Challenges & Milestones</h2>
            
            <div class="card mb-4">
                <p style="color: var(--text-secondary); margin-bottom: 16px;">
                    Complete challenges to earn points and level up! 🚀
                </p>
                <button class="btn btn-primary" onclick="handleGenerateChallenges()">
                    Generate Personalized Challenges
                </button>
            </div>

            ${state.challenges.length === 0 ? 
                '<p class="text-center" style="color: var(--text-secondary);">No challenges yet. Generate some above!</p>' :
                state.challenges.map(c => {
                    const progress = Math.min((c.current / c.target) * 100, 100);
                    const daysLeft = Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return `
                        <div class="challenge-item">
                            <div class="challenge-header">
                                <div class="challenge-title">${c.title}</div>
                                <div class="challenge-points">+${c.points} pts</div>
                            </div>
                            <div class="challenge-description">${c.description}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">
                                Progress: ${c.current} / ${c.target} • 
                                ${c.status === 'completed' ? 'Completed! 🎉' : 
                                  c.status === 'failed' ? 'Failed' :
                                  `${daysLeft} days left`}
                            </div>
                            ${c.status === 'active' ? `
                                <button class="btn btn-secondary mt-4" onclick="handleUpdateChallengeProgress('${c._id}')">
                                    Update Progress
                                </button>
                            ` : ''}
                        </div>
                    `;
                }).join('')
            }
        </div>
    `;
}

function renderLeaderboard() {
    return `
        <div class="dashboard">
            <h2 class="mb-4">Leaderboard 🏆</h2>
            
            <div class="card">
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                    See how you rank against other users! Complete challenges and track transactions to climb the leaderboard.
                </p>
                
                ${state.leaderboard.length === 0 ? 
                    '<p class="text-center" style="color: var(--text-secondary);">Leaderboard loading...</p>' :
                    state.leaderboard.map((user, index) => `
                        <div class="leaderboard-item">
                            <div class="leaderboard-rank ${index < 3 ? 'top' : ''}">#${index + 1}</div>
                            <div class="leaderboard-avatar">${user.username.charAt(0).toUpperCase()}</div>
                            <div class="leaderboard-info">
                                <div class="leaderboard-name">
                                    ${user.username} ${user._id === state.user.id ? '(You)' : ''}
                                </div>
                                <div class="leaderboard-level">Level ${user.level}</div>
                            </div>
                            <div class="leaderboard-points">${user.points} pts</div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
}

// Event Handlers
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('auth-error');

    try {
        await login(email, password);
        await Promise.all([
            fetchTransactions(),
            fetchAnalytics(),
            fetchChallenges(),
            fetchLeaderboard()
        ]);
        navigateTo('dashboard');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('auth-error');

    try {
        await register(username, email, password);
        await Promise.all([
            fetchTransactions(),
            fetchAnalytics(),
            fetchChallenges(),
            fetchLeaderboard()
        ]);
        navigateTo('dashboard');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

async function handleAddTransaction(event) {
    event.preventDefault();
    
    const transaction = {
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value
    };

    try {
        await addTransaction(transaction);
        document.getElementById('transaction-form').reset();
        renderApp();
    } catch (error) {
        alert('Error adding transaction: ' + error.message);
    }
}

async function handleDeleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        try {
            await deleteTransaction(id);
            renderApp();
        } catch (error) {
            alert('Error deleting transaction: ' + error.message);
        }
    }
}

async function handleGenerateChallenges() {
    try {
        await generateChallenges();
        renderApp();
    } catch (error) {
        alert('Error generating challenges: ' + error.message);
    }
}

async function handleUpdateChallengeProgress(id) {
    const challenge = state.challenges.find(c => c._id === id);
    
    if (!challenge) {
        alert('Challenge not found');
        return;
    }
    
    const newValue = prompt(`Enter new progress value (current: ${challenge.current}, target: ${challenge.target}):`);
    
    if (newValue !== null) {
        try {
            const current = parseFloat(newValue);
            if (isNaN(current) || current < 0) {
                alert('Please enter a valid positive number');
                return;
            }
            await updateChallenge(id, { current });
            renderApp();
        } catch (error) {
            alert('Error updating challenge: ' + error.message);
        }
    }
}

// Main Render Function
function renderApp() {
    const content = document.getElementById('content');
    
    renderNav();
    
    if (!state.user) {
        if (state.currentView === 'register') {
            content.innerHTML = renderRegisterForm();
        } else {
            content.innerHTML = renderLoginForm();
        }
        return;
    }

    switch (state.currentView) {
        case 'dashboard':
            content.innerHTML = renderDashboard();
            break;
        case 'transactions':
            content.innerHTML = renderTransactions();
            break;
        case 'challenges':
            content.innerHTML = renderChallenges();
            break;
        case 'leaderboard':
            content.innerHTML = renderLeaderboard();
            break;
        default:
            content.innerHTML = renderDashboard();
    }
}

// Initialize App
async function initApp() {
    if (state.token) {
        try {
            await fetchUserProfile();
            await Promise.all([
                fetchTransactions(),
                fetchAnalytics(),
                fetchChallenges(),
                fetchLeaderboard()
            ]);
            state.currentView = 'dashboard';
        } catch (error) {
            console.error('Error initializing app:', error);
            logout();
        }
    }
    
    renderApp();
}

// Start the app
initApp();
