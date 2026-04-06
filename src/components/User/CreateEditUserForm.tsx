import React, { useState, useEffect } from 'react';
import { User, UserRole, userManagementService } from '../../services/userManagementService';
import { adminService } from '../../services/adminService';
import { Karyawan } from '../../types';
import { showNotification } from '../../utils/helpers';

interface CreateEditUserFormProps {
  user?: User | null; // null = create mode, user = edit mode
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateEditUserForm: React.FC<CreateEditUserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = !!user;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [karyawanId, setKaryawanId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [managers, setManagers] = useState<Array<{ id: string; nama_lengkap: string }>>([]);
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
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('error', 'Error', 'Gagal load data');
    }
  };

  const validateForm = (): boolean => {
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
    if (!validateForm()) return;

    if (!confirm(`${isEditMode ? 'Update' : 'Create'} user ini?`)) return;

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
      } else {
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
    } catch (error) {
      showNotification('error', 'Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: Array<{ value: UserRole; label: string; description: string }> = [
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black mb-2">
          {isEditMode ? '✏️ Edit User' : '➕ Create New User'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {isEditMode
            ? 'Update user information and permissions'
            : 'Add new user to the system'}
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Email {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isEditMode}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            {isEditMode && (
              <p className="text-xs text-slate-400 mt-1">
                Email tidak bisa diubah dalam edit mode
              </p>
            )}
          </div>

          {/* Password (Create mode only) */}
          {!isEditMode && (
            <>
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} - {opt.description}
                </option>
              ))}
            </select>
          </div>

          {/* Link to Karyawan (Optional) */}
          {(role === 'employee' || role === 'manager') && (
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Link to Employee (Optional)
              </label>
              <select
                value={karyawanId}
                onChange={(e) => setKaryawanId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">-- Tidak di-link --</option>
                {karyawan.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama} ({k.jabatan})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manager Assignment (For Manager & Employee) */}
          {(role === 'manager' || role === 'employee') && (
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Manager (Optional)
              </label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">-- No Manager --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-xs font-bold text-blue-900">
              💡 Tip: User akan menerima email dengan link untuk set password awal
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};
