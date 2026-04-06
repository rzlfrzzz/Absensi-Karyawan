import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { userManagementService } from '../services/userManagementService';
import { CreateEditUserForm } from '../components/User/CreateEditUserForm';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { showNotification } from '../utils/helpers';
export const UserManagementPage = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    // Check permission
    useEffect(() => {
        if (!currentUser || !userManagementService.canManageUsers(currentUser.role)) {
            showNotification('error', 'Akses Ditolak', 'Hanya Super Admin yang bisa manage users');
            navigate('/backoffice', { replace: true });
        }
    }, [currentUser, navigate]);
    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const allUsers = await userManagementService.getAllUsers();
            setUsers(allUsers);
        }
        catch (error) {
            console.error('Failed to fetch users:', error);
            showNotification('error', 'Error', 'Gagal load users');
        }
        finally {
            setLoading(false);
        }
    };
    // Filter users
    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    const handleDeleteUser = async (user_id) => {
        if (!confirm('Yakin hapus user ini?'))
            return;
        try {
            const success = await userManagementService.deleteUser(user_id);
            if (success) {
                showNotification('success', 'Sukses', 'User berhasil dihapus');
                fetchUsers();
            }
            else {
                showNotification('error', 'Error', 'Gagal hapus user');
            }
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
        }
    };
    const handleDeactivateUser = async (user_id) => {
        try {
            const success = await userManagementService.deactivateUser(user_id);
            if (success) {
                showNotification('success', 'Sukses', 'User berhasil dinonaktifkan');
                fetchUsers();
            }
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
        }
    };
    const handleReactivateUser = async (user_id) => {
        try {
            const success = await userManagementService.reactivateUser(user_id);
            if (success) {
                showNotification('success', 'Sukses', 'User berhasil diaktifkan');
                fetchUsers();
            }
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
        }
    };
    const getRoleColor = (role) => {
        const colors = {
            super_admin: 'bg-red-100 text-red-700',
            hr_admin: 'bg-blue-100 text-blue-700',
            manager: 'bg-purple-100 text-purple-700',
            employee: 'bg-gray-100 text-gray-700',
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };
    const getRoleLabel = (role) => {
        const labels = {
            super_admin: 'Super Admin',
            hr_admin: 'HR Admin',
            manager: 'Manager',
            employee: 'Employee',
        };
        return labels[role];
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin", children: _jsx("div", { className: "w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full" }) }), _jsx("p", { className: "mt-4 text-slate-600", children: "Loading users..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-12 font-sans", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-12", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl font-black tracking-tight text-slate-900 italic uppercase", children: ["\uD83D\uDC65 User ", _jsx("span", { className: "text-indigo-600", children: "Management" })] }), _jsx("p", { className: "text-slate-400 text-xs font-bold tracking-[0.2em] italic uppercase mt-2", children: "Manage sistem users & permissions" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(LanguageSwitcher, {}), _jsx("button", { onClick: () => navigate('/backoffice'), className: "px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all", children: "\u2190 Kembali" }), _jsx("button", { onClick: () => setShowCreateForm(true), className: "px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all", children: "\u2795 Create User" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8", children: [_jsx("input", { type: "text", placeholder: "Search by email or name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" }), _jsxs("select", { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), className: "px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: [_jsx("option", { value: "all", children: "All Roles" }), _jsx("option", { value: "super_admin", children: "Super Admin" }), _jsx("option", { value: "hr_admin", children: "HR Admin" }), _jsx("option", { value: "manager", children: "Manager" }), _jsx("option", { value: "employee", children: "Employee" })] })] }), _jsxs("div", { className: "bg-white rounded-3xl shadow-sm overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-slate-50 text-slate-400 uppercase text-[9px] tracking-[0.3em] font-black sticky top-0", children: _jsxs("tr", { children: [_jsx("th", { className: "p-6 w-12", children: "#" }), _jsx("th", { className: "p-6", children: "Email" }), _jsx("th", { className: "p-6", children: "Nama Lengkap" }), _jsx("th", { className: "p-6", children: "Role" }), _jsx("th", { className: "p-6", children: "Status" }), _jsx("th", { className: "p-6", children: "Created" }), _jsx("th", { className: "p-6 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-50 italic", children: filteredUsers.length > 0 ? (filteredUsers.map((u, idx) => (_jsxs("tr", { className: "hover:bg-slate-50/80 transition-all group", children: [_jsx("td", { className: "p-6 font-black text-slate-300 text-xs", children: String(idx + 1).padStart(2, '0') }), _jsx("td", { className: "p-6", children: _jsx("p", { className: "font-bold text-slate-900", children: u.email }) }), _jsx("td", { className: "p-6", children: _jsx("p", { className: "text-slate-600", children: u.nama_lengkap }) }), _jsx("td", { className: "p-6", children: _jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleColor(u.role)}`, children: getRoleLabel(u.role) }) }), _jsx("td", { className: "p-6", children: _jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.active
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-orange-100 text-orange-700'}`, children: u.active ? '✓ Active' : '✗ Inactive' }) }), _jsx("td", { className: "p-6 text-slate-500 text-xs", children: u.created_at
                                                        ? new Date(u.created_at).toLocaleDateString('id-ID')
                                                        : '-' }), _jsx("td", { className: "p-6 text-right", children: _jsxs("div", { className: "flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all", children: [_jsx("button", { onClick: () => setEditingUser(u), className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[8px] font-black uppercase hover:bg-blue-200 transition-all", title: "Edit user", children: "\u270F\uFE0F" }), u.active ? (_jsx("button", { onClick: () => u.id && handleDeactivateUser(u.id), className: "px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[8px] font-black uppercase hover:bg-orange-200 transition-all", title: "Deactivate user", children: "\uD83D\uDEAB" })) : (_jsx("button", { onClick: () => u.id && handleReactivateUser(u.id), className: "px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[8px] font-black uppercase hover:bg-emerald-200 transition-all", title: "Reactivate user", children: "\u2713" })), _jsx("button", { onClick: () => u.id && handleDeleteUser(u.id), className: "px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[8px] font-black uppercase hover:bg-red-200 transition-all", title: "Delete user", children: "\uD83D\uDDD1\uFE0F" })] }) })] }, u.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "p-8 text-center text-slate-400", children: "No users found" }) })) })] }) }), _jsx("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-200", children: _jsxs("p", { className: "text-xs text-slate-500 font-bold", children: ["Total: ", _jsx("span", { className: "text-slate-900 font-black", children: filteredUsers.length }), " users"] }) })] }), showCreateForm && (_jsx(CreateEditUserForm, { user: null, onSuccess: () => {
                        setShowCreateForm(false);
                        fetchUsers();
                    }, onCancel: () => setShowCreateForm(false) })), editingUser && (_jsx(CreateEditUserForm, { user: editingUser, onSuccess: () => {
                        setEditingUser(null);
                        fetchUsers();
                    }, onCancel: () => setEditingUser(null) }))] }) }));
};
