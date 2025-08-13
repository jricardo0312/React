import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Interfaces e Tipos ---
interface User {
  id: string;
  fullName: string;
  address: string;
  cpf: string;
  initialPassword?: string;
  password?: string; // Will store the final password
  education: string;
  dob: string;
  phone: string;
  role: 'Admin' | 'User';
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  userId: string;
  userName: string;
}

interface Transaction {
  id: string;
  type: 'Receita' | 'Despesa';
  description: string;
  value: number;
  transactionDate: string;
  paymentDate: string;
  category: string;
  paymentMethod: 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'PIX' | 'Transferência';
  notes: string;
  userId: string; 
  userName: string; 
}

interface FinancialCategories {
    expenses: string[];
    revenues: string[];
}


// --- Componente: Cabeçalho ---
const Header = ({ onLogout }) => (
  <header className="header" role="banner">
    <h2>Dashboard</h2>
    <button onClick={onLogout} className="logout-button">Logout</button>
  </header>
);

// --- Componente: Menu Lateral ---
const Sidebar = ({ activeView, onNavigate, currentUser }) => (
  <aside className="sidebar" role="navigation">
    <div className="sidebar-header">
      <h3>My App</h3>
    </div>
    <ul className="nav-list">
      <li>
        <button onClick={() => onNavigate('Dashboard')} className={`nav-item ${activeView === 'Dashboard' ? 'active' : ''}`}>
          Dashboard
        </button>
      </li>
      <li>
        <button onClick={() => onNavigate('Users')} className={`nav-item ${activeView === 'Users' ? 'active' : ''}`}>
          Users
        </button>
      </li>
       <li>
        <button onClick={() => onNavigate('Appointments')} className={`nav-item ${activeView === 'Appointments' ? 'active' : ''}`}>
          Agendamentos
        </button>
      </li>
      {currentUser.role === 'Admin' && (
         <li>
            <button onClick={() => onNavigate('Finance')} className={`nav-item ${activeView === 'Finance' ? 'active' : ''}`}>
              Financeiro
            </button>
         </li>
      )}
      <li><button disabled className="nav-item">Analytics</button></li>
      <li><button disabled className="nav-item">Reports</button></li>
      {currentUser.role === 'Admin' && (
        <li>
            <button onClick={() => onNavigate('Settings')} className={`nav-item ${activeView === 'Settings' ? 'active' : ''}`}>
              Settings
            </button>
        </li>
      )}
    </ul>
  </aside>
);

// --- Componente: Rodapé ---
const Footer = () => (
  <footer className="footer" role="contentinfo">
    <p>&copy; 2024 Your App. All rights reserved.</p>
  </footer>
);

// --- Componente: Conteúdo do Dashboard ---
const DashboardContent = () => (
  <>
    <h1>Welcome to your Dashboard!</h1>
    <p>This is where your main content will go. You can add charts, tables, and other components here.</p>
  </>
);

// --- Componente: Formulário de Usuário (Modal) ---
const UserForm = ({ onSave, onCancel, userToEdit, mode = 'admin' /* 'admin' or 'signup' */ }) => {
  const isEditing = !!userToEdit;
  const isSignup = mode === 'signup';

  const generatePassword = () => Math.random().toString(36).slice(-8);

  const getInitialState = () => {
    if (userToEdit) {
      return { ...userToEdit, initialPassword: '' }; // Don't load password for editing
    }
    return {
      id: new Date().toISOString(),
      fullName: '',
      address: '',
      cpf: '',
      initialPassword: isSignup ? '' : generatePassword(),
      education: '',
      dob: '',
      phone: '',
      role: 'User' as 'User' | 'Admin',
    };
  };

  const [user, setUser] = useState(getInitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['fullName', 'cpf', 'dob', 'phone'];
    if (!isEditing || isSignup) {
        requiredFields.push('initialPassword');
    }
    
    for (const field of requiredFields) {
        if (!user[field]) {
            alert('Please fill all required fields (*).');
            return;
        }
    }
    
    const userToSave = { ...user, password: user.initialPassword || user.password };
    if (isEditing && !user.initialPassword) {
      delete userToSave.initialPassword; 
    }

    onSave(userToSave);
  };
  
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h2 id="modal-title">{isEditing ? 'Edit User' : (isSignup ? 'Create Account' : 'Add New User')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" value={user.fullName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="dob">Date of Birth (6 digits) *</label>
              <input type="text" id="dob" name="dob" value={user.dob} onChange={handleChange} placeholder="DDMMYY" maxLength={6} required />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="cpf">CPF (used for login) *</label>
              <input type="text" id="cpf" name="cpf" value={user.cpf} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Mobile Phone (with DDD) *</label>
              <input type="text" id="phone" name="phone" value={user.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" value={user.address} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="education">Education</label>
            <input type="text" id="education" name="education" value={user.education} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="initialPassword">{isEditing ? 'New Password (optional)' : 'Password *'}</label>
              <input 
                type="password" 
                id="initialPassword" 
                name="initialPassword" 
                value={user.initialPassword || ''} 
                onChange={handleChange} 
                minLength={8} 
                required={!isEditing}
                readOnly={!isSignup && !isEditing}
                placeholder={isEditing ? 'Leave blank to keep current' : '8+ characters'}
              />
            </div>
            {mode === 'admin' && (
              <div className="input-group">
                <label htmlFor="role">Role *</label>
                <select id="role" name="role" value={user.role} onChange={handleChange} required>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-save">{isSignup ? 'Sign Up' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Componente: Gerenciamento de Usuários ---
const UserManagement = ({ users, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="page-header">
      <h1>User Management</h1>
      <button onClick={onAdd} className="btn-add-user">Add New User</button>
    </div>
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>CPF</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map(user => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.cpf}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td className="actions">
                <button onClick={() => onEdit(user)} className="btn-edit">Edit</button>
                <button onClick={() => onDelete(user.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Componente: Formulário de Agendamento ---
const AppointmentForm = ({ onSave, onCancel, appointmentToEdit }) => {
    const isEditing = !!appointmentToEdit;
    
    const getInitialState = () => {
        if (appointmentToEdit) return { ...appointmentToEdit };
        return {
            id: new Date().toISOString(),
            title: '',
            date: '',
            time: '',
            description: '',
        };
    };

    const [appointment, setAppointment] = useState(getInitialState);

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAppointment(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment.title || !appointment.date || !appointment.time) {
            alert('Please fill in Title, Date, and Time.');
            return;
        }
        onSave(appointment);
    };

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
            <div className="modal-content">
                <h2 id="appointment-modal-title">{isEditing ? 'Edit Appointment' : 'New Appointment'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="title">Title *</label>
                        <input type="text" id="title" name="title" value={appointment.title} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="date">Date *</label>
                            <input type="date" id="date" name="date" value={appointment.date} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="time">Time *</label>
                            <select id="time" name="time" value={appointment.time} onChange={handleChange} required>
                                <option value="" disabled>Select a time</option>
                                {timeOptions.map(timeValue => (
                                    <option key={timeValue} value={timeValue}>{timeValue}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={appointment.description} onChange={handleChange} rows={3}></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Componente: Gerenciamento de Agendamentos ---
const AppointmentManagement = ({ appointments, currentUser, onAdd, onEdit, onDelete }) => {
    const isAdmin = currentUser.role === 'Admin';
    const userAppointments = isAdmin ? appointments : appointments.filter(apt => apt.userId === currentUser.id);

    return (
        <div>
            <div className="page-header">
                <h1>Appointments</h1>
                <button onClick={onAdd} className="btn-add-user">New Appointment</button>
            </div>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            {isAdmin && <th>User</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userAppointments.length > 0 ? userAppointments.map(apt => (
                            <tr key={apt.id}>
                                <td>{apt.title}</td>
                                <td>{apt.date}</td>
                                <td>{apt.time}</td>
                                {isAdmin && <td>{apt.userName}</td>}
                                <td className="actions">
                                    <button onClick={() => onEdit(apt)} className="btn-edit">Edit</button>
                                    <button onClick={() => onDelete(apt.id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4}>No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Componente: Formulário de Transação Financeira ---
const TransactionForm = ({ onSave, onCancel, transactionToEdit, users, categories }) => {
    const isEditing = !!transactionToEdit;

    const getInitialState = () => {
        if (transactionToEdit) return transactionToEdit;
        return {
            id: new Date().toISOString(),
            type: 'Receita' as 'Receita' | 'Despesa',
            description: '',
            value: 0,
            transactionDate: '',
            paymentDate: '',
            category: '',
            paymentMethod: 'PIX' as 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'PIX' | 'Transferência',
            notes: '',
            userId: '',
        };
    };

    const [transaction, setTransaction] = useState(getInitialState);
    const categoryList = transaction.type === 'Receita' ? categories.revenues : categories.expenses;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) : value;
        setTransaction(prev => ({...prev, [name]: finalValue}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction.description || transaction.value <= 0 || !transaction.transactionDate || !transaction.userId) {
            alert('Please fill in Description, Value, Transaction Date, and associate a User.');
            return;
        }
        onSave(transaction);
    };

    return (
         <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
            <div className="modal-content">
                <h2 id="transaction-modal-title">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="description">Description *</label>
                        <input type="text" id="description" name="description" value={transaction.description} onChange={handleChange} required />
                    </div>
                     <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="value">Value *</label>
                            <input type="number" step="0.01" id="value" name="value" value={transaction.value} onChange={handleChange} required />
                        </div>
                         <div className="input-group">
                            <label htmlFor="type">Type *</label>
                            <select id="type" name="type" value={transaction.type} onChange={handleChange}>
                                <option value="Receita">Receita</option>
                                <option value="Despesa">Despesa</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="transactionDate">Transaction Date *</label>
                            <input type="date" id="transactionDate" name="transactionDate" value={transaction.transactionDate} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="paymentDate">Payment Date</label>
                            <input type="date" id="paymentDate" name="paymentDate" value={transaction.paymentDate} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" value={transaction.category} onChange={handleChange}>
                                <option value="" disabled>Select a category</option>
                                {categoryList.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="paymentMethod">Payment Method</label>
                            <select id="paymentMethod" name="paymentMethod" value={transaction.paymentMethod} onChange={handleChange}>
                                <option value="PIX">PIX</option>
                                <option value="Cartão de Crédito">Cartão de Crédito</option>
                                <option value="Cartão de Débito">Cartão de Débito</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Transferência">Transferência</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="userId">Associated User *</label>
                         <select id="userId" name="userId" value={transaction.userId} onChange={handleChange} required>
                            <option value="" disabled>Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" value={transaction.notes} onChange={handleChange} rows={3}></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente: Página de Configurações ---
const SettingsPage = ({ categories, onCategoriesChange, transactions }) => {
    const [newExpense, setNewExpense] = useState('');
    const [newRevenue, setNewRevenue] = useState('');

    const handleAddCategory = (type: 'expenses' | 'revenues') => {
        const value = type === 'expenses' ? newExpense.trim() : newRevenue.trim();
        if (!value) return;
        if (categories[type].includes(value)) {
            alert(`A categoria "${value}" já existe.`);
            return;
        }

        onCategoriesChange((prev: FinancialCategories) => ({
            ...prev,
            [type]: [...prev[type], value].sort()
        }));

        if (type === 'expenses') setNewExpense('');
        else setNewRevenue('');
    };

    const handleDeleteCategory = (type: 'expenses' | 'revenues', categoryToDelete: string) => {
        const isCategoryInUse = transactions.some(
            (transaction: Transaction) => transaction.category === categoryToDelete
        );

        if (isCategoryInUse) {
            alert(`A categoria "${categoryToDelete}" não pode ser excluída, pois está sendo utilizada em uma ou mais transações. Por favor, altere as transações associadas antes de tentar excluir a categoria.`);
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryToDelete}"? Esta ação não pode ser desfeita.`)) {
            onCategoriesChange((prev: FinancialCategories) => ({
                ...prev,
                [type]: prev[type].filter(cat => cat !== categoryToDelete)
            }));
        }
    };

    return (
        <div className="settings-page">
            <h1>System Settings</h1>
            <p>Manage labels for classifying financial transactions.</p>

            <div className="settings-container">
                <div className="category-manager">
                    <h2>Expense Categories</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddCategory('expenses'); }} className="add-category-form">
                        <input
                            type="text"
                            value={newExpense}
                            onChange={(e) => setNewExpense(e.target.value)}
                            placeholder="New expense category"
                            aria-label="New expense category"
                        />
                        <button type="submit" className="btn-add-category">Add</button>
                    </form>
                    <ul className="category-list">
                        {categories.expenses.length > 0 ? categories.expenses.map(cat => (
                            <li key={cat}>
                                <span>{cat}</span>
                                <button onClick={() => handleDeleteCategory('expenses', cat)} className="btn-delete-category" aria-label={`Excluir ${cat}`}>Excluir</button>
                            </li>
                        )) : <li>No expense categories defined.</li>}
                    </ul>
                </div>

                <div className="category-manager">
                    <h2>Revenue Categories</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddCategory('revenues'); }} className="add-category-form">
                        <input
                            type="text"
                            value={newRevenue}
                            onChange={(e) => setNewRevenue(e.target.value)}
                            placeholder="New revenue category"
                            aria-label="New revenue category"
                        />
                        <button type="submit" className="btn-add-category">Add</button>
                    </form>
                    <ul className="category-list">
                        {categories.revenues.length > 0 ? categories.revenues.map(cat => (
                            <li key={cat}>
                                <span>{cat}</span>
                                <button onClick={() => handleDeleteCategory('revenues', cat)} className="btn-delete-category" aria-label={`Excluir ${cat}`}>Excluir</button>
                            </li>
                        )) : <li>No revenue categories defined.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- Componente: Gestão Financeira ---
const FinanceManagement = ({ transactions, users, onAdd, onEdit, onDelete }) => {
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const totalReceitas = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
    const totalDespesas = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
    const saldo = totalReceitas - totalDespesas;

    return (
        <div>
            <h1>Financial Management</h1>
            <div className="finance-summary">
                <div className="summary-card receita">
                    <h3>Total Revenues</h3>
                    <p>{formatCurrency(totalReceitas)}</p>
                </div>
                <div className="summary-card despesa">
                    <h3>Total Expenses</h3>
                    <p>{formatCurrency(totalDespesas)}</p>
                </div>
                <div className="summary-card saldo">
                    <h3>Current Balance</h3>
                    <p>{formatCurrency(saldo)}</p>
                </div>
            </div>
            <div className="page-header">
                <h2>All Transactions</h2>
                <button onClick={onAdd} className="btn-add-user">New Transaction</button>
            </div>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Value</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>User</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.description}</td>
                                <td className={t.type === 'Receita' ? 'text-receita' : 'text-despesa'}>{formatCurrency(t.value)}</td>
                                <td>{t.type}</td>
                                <td>{t.transactionDate}</td>
                                <td>{t.userName}</td>
                                <td>{t.category}</td>
                                <td className="actions">
                                    <button onClick={() => onEdit(t)} className="btn-edit">Edit</button>
                                    <button onClick={() => onDelete(t.id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7}>No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Componente: Painel Principal ---
const Dashboard = ({ onLogout, currentUser, users, onUsersChange, appointments, onAppointmentsChange, transactions, onTransactionsChange, financialCategories, onFinancialCategoriesChange }) => {
  const [activeView, setActiveView] = useState('Dashboard');
  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Appointment Modal State
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  // Transaction Modal State
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // User CRUD
  const handleAddUser = () => { setEditingUser(null); setIsUserModalOpen(true); };
  const handleEditUser = (user: User) => { setEditingUser(user); setIsUserModalOpen(true); };
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUsersChange(users.filter(user => user.id !== userId));
    }
  };
  const handleSaveUser = (user: User) => {
    const isEditing = users.some(u => u.id === user.id);
    onUsersChange(isEditing ? users.map(u => (u.id === user.id ? user : u)) : [...users, user]);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  // Appointment CRUD
  const handleAddAppointment = () => { setEditingAppointment(null); setIsAppointmentModalOpen(true); };
  const handleEditAppointment = (apt: Appointment) => { setEditingAppointment(apt); setIsAppointmentModalOpen(true); };
  const handleDeleteAppointment = (aptId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      onAppointmentsChange(appointments.filter(apt => apt.id !== aptId));
    }
  };
  const handleSaveAppointment = (apt: Appointment) => {
      const isEditing = appointments.some(a => a.id === apt.id);
      let updatedAppointments;
      if (isEditing) {
          updatedAppointments = appointments.map(a => (a.id === apt.id ? apt : a));
      } else {
          const newApt = {...apt, userId: currentUser.id, userName: currentUser.fullName };
          updatedAppointments = [...appointments, newApt];
      }
      onAppointmentsChange(updatedAppointments);
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
  };

  // Transaction CRUD
  const handleAddTransaction = () => { setEditingTransaction(null); setIsTransactionModalOpen(true); };
  const handleEditTransaction = (trans: Transaction) => { setEditingTransaction(trans); setIsTransactionModalOpen(true); };
  const handleDeleteTransaction = (transId: string) => {
      if(window.confirm('Are you sure you want to delete this transaction?')) {
          onTransactionsChange(transactions.filter(t => t.id !== transId));
      }
  };
  const handleSaveTransaction = (trans: Transaction) => {
      const isEditing = transactions.some(t => t.id === trans.id);
      const user = users.find(u => u.id === trans.userId);
      const transactionWithUserName = {...trans, userName: user ? user.fullName : 'N/A' };
      
      onTransactionsChange(isEditing ? transactions.map(t => (t.id === trans.id ? transactionWithUserName : t)) : [...transactions, transactionWithUserName]);
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Users':
        return currentUser.role === 'Admin' ? 
          <UserManagement users={users} onAdd={handleAddUser} onEdit={handleEditUser} onDelete={handleDeleteUser} /> : 
          <p>You do not have permission to view this page.</p>;
      case 'Appointments':
        return <AppointmentManagement appointments={appointments} currentUser={currentUser} onAdd={handleAddAppointment} onEdit={handleEditAppointment} onDelete={handleDeleteAppointment} />;
      case 'Finance':
         return currentUser.role === 'Admin' ?
            <FinanceManagement transactions={transactions} users={users} onAdd={handleAddTransaction} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} /> :
            <p>You do not have permission to view this page.</p>;
      case 'Settings':
        return currentUser.role === 'Admin' ?
          <SettingsPage 
            categories={financialCategories} 
            onCategoriesChange={onFinancialCategoriesChange} 
            transactions={transactions} 
          /> :
          <p>You do not have permission to view this page.</p>;
      case 'Dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeView={activeView} onNavigate={setActiveView} currentUser={currentUser} />
      <div className="main-panel">
        <Header onLogout={onLogout} />
        <main className="main-content" role="main">
          {renderContent()}
        </main>
        <Footer />
      </div>
      {isUserModalOpen && <UserForm onSave={handleSaveUser} onCancel={() => setIsUserModalOpen(false)} userToEdit={editingUser} />}
      {isAppointmentModalOpen && <AppointmentForm onSave={handleSaveAppointment} onCancel={() => setIsAppointmentModalOpen(false)} appointmentToEdit={editingAppointment} />}
      {isTransactionModalOpen && <TransactionForm onSave={handleSaveTransaction} onCancel={() => setIsTransactionModalOpen(false)} transactionToEdit={editingTransaction} users={users} categories={financialCategories} />}
    </div>
  );
};

// --- Componente: Página de Login ---
const LoginPage = ({ onLogin, onGoToSignup }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!cpf || !password) {
      alert('Please enter CPF and password.');
      return;
    }
    onLogin(cpf, password);
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert('Forgot password functionality is not yet implemented.');
  };

  return (
    <div className="login-container">
      <div className="login-box" role="main">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text" id="cpf" name="cpf"
              placeholder="Enter your CPF"
              aria-label="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password" id="password" name="password"
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-footer-links">
          <a href="#" onClick={handleForgotPassword} className="forgot-password-link">
            Forgot password?
          </a>
        </div>
        <div className="signup-prompt">
            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onGoToSignup(); }} className="signup-link">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Aplicação Principal ---
const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [financialCategories, setFinancialCategories] = useState<FinancialCategories>({
    expenses: ['Salaries', 'Rent', 'Supplies', 'Marketing'],
    revenues: ['Service Rendered', 'Product Sale', 'Consulting'],
  });

  // Seed an admin user for testing
  useEffect(() => {
    const adminUser: User = {
        id: 'admin001',
        fullName: 'Admin User',
        cpf: 'admin',
        password: 'admin',
        address: '123 Admin St',
        dob: '010190',
        education: 'System Administration',
        phone: '555-0100',
        role: 'Admin'
    };
    setUsers([adminUser]);
  }, []);

  const handleLogin = (cpf, password) => {
      const user = users.find(u => u.cpf === cpf && u.password === password);
      if (user) {
          setCurrentUser(user);
      } else {
          alert('Invalid credentials. Please try again.');
      }
  };
  const handleLogout = () => setCurrentUser(null);
  
  const handleGoToSignup = () => setShowSignupModal(true);
  const handleCloseSignup = () => setShowSignupModal(false);

  const handleSignupSave = (newUser: User) => {
    // Ensure new signups are always 'User' role
    const userWithRole = {...newUser, role: 'User' as 'User'};
    setUsers(prev => [...prev, userWithRole]);
    setShowSignupModal(false);
    setCurrentUser(userWithRole); // Auto-login after signup
  };

  return (
    <>
      {currentUser ? (
        <Dashboard 
          onLogout={handleLogout} 
          currentUser={currentUser}
          users={users} 
          onUsersChange={setUsers} 
          appointments={appointments}
          onAppointmentsChange={setAppointments}
          transactions={transactions}
          onTransactionsChange={setTransactions}
          financialCategories={financialCategories}
          onFinancialCategoriesChange={setFinancialCategories}
        />
      ) : (
        <LoginPage onLogin={handleLogin} onGoToSignup={handleGoToSignup} />
      )}
      {showSignupModal && (
        <UserForm
          onSave={handleSignupSave}
          onCancel={handleCloseSignup}
          userToEdit={null}
          mode="signup"
        />
      )}
    </>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
