import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { userManagementService, User, UserRole } from '../services/userManagementService';
import { CreateEditUserForm } from '../components/User/CreateEditUserForm';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { showNotification } from '../utils/helpers';

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Check permission
  useEffect(() => {
    if (!currentUser || !userManagementService.canManageUsers(currentUser.role)) {
      showNotification(
        'error',
        'Akses Ditolak',
        'Hanya Super Admin yang bisa manage users'
      );
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
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showNotification('error', 'Error', 'Gagal load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (user_id: string) => {
    if (!confirm('Yakin hapus user ini?')) return;

    try {
      const success = await userManagementService.deleteUser(user_id);
      if (success) {
        showNotification('success', 'Sukses', 'User berhasil dihapus');
        fetchUsers();
      } else {
        showNotification('error', 'Error', 'Gagal hapus user');
      }
    } catch (error) {
      showNotification('error', 'Error', String(error));
    }
  };

  const handleDeactivateUser = async (user_id: string) => {
    try {
      const success = await userManagementService.deactivateUser(user_id);
      if (success) {
        showNotification('success', 'Sukses', 'User berhasil dinonaktifkan');
        fetchUsers();
      }
    } catch (error) {
      showNotification('error', 'Error', String(error));
    }
  };

  const handleReactivateUser = async (user_id: string) => {
    try {
      const success = await userManagementService.reactivateUser(user_id);
      if (success) {
        showNotification('success', 'Sukses', 'User berhasil diaktifkan');
        fetchUsers();
      }
    } catch (error) {
      showNotification('error', 'Error', String(error));
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      super_admin: 'bg-red-100 text-red-700',
      hr_admin: 'bg-blue-100 text-blue-700',
      manager: 'bg-purple-100 text-purple-700',
      employee: 'bg-gray-100 text-gray-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      super_admin: 'Super Admin',
      hr_admin: 'HR Admin',
      manager: 'Manager',
      employee: 'Employee',
    };
    return labels[role];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">
              👥 User <span className="text-indigo-600">Management</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold tracking-[0.2em] italic uppercase mt-2">
              Manage sistem users & permissions
            </p>
          </div>

          <div className="flex gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/backoffice')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
            >
              ← Kembali
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all"
            >
              ➕ Create User
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="hr_admin">HR Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] tracking-[0.3em] font-black sticky top-0">
                <tr>
                  <th className="p-6 w-12">#</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Nama Lengkap</th>
                  <th className="p-6">Role</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Created</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 italic">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="p-6 font-black text-slate-300 text-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      <td className="p-6">
                        <p className="font-bold text-slate-900">{u.email}</p>
                      </td>

                      <td className="p-6">
                        <p className="text-slate-600">{u.nama_lengkap}</p>
                      </td>

                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleColor(
                            u.role
                          )}`}
                        >
                          {getRoleLabel(u.role)}
                        </span>
                      </td>

                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {u.active ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>

                      <td className="p-6 text-slate-500 text-xs">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString('id-ID')
                          : '-'}
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[8px] font-black uppercase hover:bg-blue-200 transition-all"
                            title="Edit user"
                          >
                            ✏️
                          </button>

                          {u.active ? (
                            <button
                              onClick={() => u.id && handleDeactivateUser(u.id)}
                              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[8px] font-black uppercase hover:bg-orange-200 transition-all"
                              title="Deactivate user"
                            >
                              🚫
                            </button>
                          ) : (
                            <button
                              onClick={() => u.id && handleReactivateUser(u.id)}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[8px] font-black uppercase hover:bg-emerald-200 transition-all"
                              title="Reactivate user"
                            >
                              ✓
                            </button>
                          )}

                          <button
                            onClick={() => u.id && handleDeleteUser(u.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[8px] font-black uppercase hover:bg-red-200 transition-all"
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500 font-bold">
              Total: <span className="text-slate-900 font-black">{filteredUsers.length}</span> users
            </p>
          </div>
        </div>

        {/* CREATE/EDIT MODALS */}
        {showCreateForm && (
          <CreateEditUserForm
            user={null}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchUsers();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {editingUser && (
          <CreateEditUserForm
            user={editingUser}
            onSuccess={() => {
              setEditingUser(null);
              fetchUsers();
            }}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </div>
    </div>
  );
};
