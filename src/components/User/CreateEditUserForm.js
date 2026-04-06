import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { userManagementService } from '../../services/userManagementService';
import { adminService } from '../../services/adminService';
import { showNotification } from '../../utils/helpers';
export const CreateEditUserForm = ({ user, onSuccess, onCancel, }) => {
    const isEditMode = !!user;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [role, setRole] = useState('employee');
    const [karyawanId, setKaryawanId] = useState('');
    const [managerId, setManagerId] = useState('');
    const [karyawan, setKaryawan] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);
    // Load existing user data in edit mode
    useEffect(() => {
        if (isEditMode && user) {
            setEmail(user.email);
            setNamaLengkap(user.nama_lengkap);
            setRole(user.role);
            setKaryawanId(user.karyawan_id || '');
            setManagerId(user.manager_id || '');
            // Don't set password in edit mode
        }
    }, [user, isEditMode]);
    const fetchData = async () => {
        try {
            const [karyawanData, managerData] = await Promise.all([
                adminService.getAllKaryawan(),
                userManagementService.getManagers(),
            ]);
            setKaryawan(karyawanData);
            setManagers(managerData);
        }
        catch (error) {
            console.error('Failed to fetch data:', error);
            showNotification('error', 'Error', 'Gagal load data');
        }
    };
    const validateForm = () => {
        if (!email.trim()) {
            showNotification('error', 'Validation', 'Email harus diisi');
            return false;
        }
        if (!namaLengkap.trim()) {
            showNotification('error', 'Validation', 'Nama lengkap harus diisi');
            return false;
        }
        if (!isEditMode) {
            if (!password || password.length < 8) {
                showNotification('error', 'Validation', 'Password minimal 8 karakter');
                return false;
            }
            if (password !== confirmPassword) {
                showNotification('error', 'Validation', 'Password tidak cocok');
                return false;
            }
        }
        // Basic email validation
        if (!email.includes('@')) {
            showNotification('error', 'Validation', 'Email tidak valid');
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        if (!validateForm())
            return;
        if (!confirm(`${isEditMode ? 'Update' : 'Create'} user ini?`))
            return;
        try {
            setLoading(true);
            if (isEditMode && user?.id) {
                // Update user
                const success = await userManagementService.updateUser(user.id, {
                    email,
                    nama_lengkap: namaLengkap,
                    role,
                    karyawan_id: karyawanId || undefined,
                    manager_id: managerId || undefined,
                });
                if (success) {
                    showNotification('success', 'Sukses', 'User berhasil diupdate');
                    onSuccess();
                }
            }
            else {
                // Create user
                const { user_id, success } = await userManagementService.createUser({
                    email,
                    password,
                    nama_lengkap: namaLengkap,
                    role,
                    karyawan_id: karyawanId || undefined,
                    manager_id: managerId || undefined,
                });
                if (success) {
                    showNotification('success', 'Sukses', `User berhasil dibuat. ID: ${user_id}`);
                    onSuccess();
                }
            }
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
        }
        finally {
            setLoading(false);
        }
    };
    const roleOptions = [
        {
            value: 'super_admin',
            label: 'Super Admin',
            description: 'Full system access',
        },
        {
            value: 'hr_admin',
            label: 'HR Admin',
            description: 'Payroll & attendance management',
        },
        {
            value: 'manager',
            label: 'Manager',
            description: 'Team approval & analytics',
        },
        {
            value: 'employee',
            label: 'Employee',
            description: 'View own attendance & salary',
        },
    ];
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("h2", { className: "text-2xl font-black mb-2", children: isEditMode ? '✏️ Edit User' : '➕ Create New User' }), _jsx("p", { className: "text-slate-500 text-sm mb-6", children: isEditMode
                        ? 'Update user information and permissions'
                        : 'Add new user to the system' }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Email ", !isEditMode && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "user@example.com", disabled: isEditMode, className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:cursor-not-allowed" }), isEditMode && (_jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Email tidak bisa diubah dalam edit mode" }))] }), !isEditMode && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Min 8 characters", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-3 text-slate-500 hover:text-slate-700", children: showPassword ? '👁️' : '👁️‍🗨️' })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Confirm Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: showPassword ? 'text' : 'password', value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Repeat password", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" })] })] })), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Nama Lengkap ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: namaLengkap, onChange: (e) => setNamaLengkap(e.target.value), placeholder: "John Doe", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Role ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("select", { value: role, onChange: (e) => setRole(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: roleOptions.map((opt) => (_jsxs("option", { value: opt.value, children: [opt.label, " - ", opt.description] }, opt.value))) })] }), (role === 'employee' || role === 'manager') && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Link to Employee (Optional)" }), _jsxs("select", { value: karyawanId, onChange: (e) => setKaryawanId(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: [_jsx("option", { value: "", children: "-- Tidak di-link --" }), karyawan.map((k) => (_jsxs("option", { value: k.id, children: [k.nama, " (", k.jabatan, ")"] }, k.id)))] })] })), (role === 'manager' || role === 'employee') && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Manager (Optional)" }), _jsxs("select", { value: managerId, onChange: (e) => setManagerId(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: [_jsx("option", { value: "", children: "-- No Manager --" }), managers.map((m) => (_jsx("option", { value: m.id, children: m.nama_lengkap }, m.id)))] })] })), _jsx("div", { className: "bg-blue-50 p-4 rounded-xl", children: _jsx("p", { className: "text-xs font-bold text-blue-900", children: "\uD83D\uDCA1 Tip: User akan menerima email dengan link untuk set password awal" }) })] }), _jsxs("div", { className: "flex gap-3 mt-8", children: [_jsx("button", { onClick: onCancel, className: "flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50", disabled: loading, children: "Cancel" }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update User' : 'Create User' })] })] }) }));
};
