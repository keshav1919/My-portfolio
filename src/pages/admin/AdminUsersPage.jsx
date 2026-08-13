import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/ui/Avatar';
import { UserDetailModal } from '../../components/admin/UserDetailModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  getAllUsers,
  setUserStatus,
  setUserRole,
  logAdminAction
} from '../../services/firestoreService';
import { Users, Search, Filter, Shield, Eye, Lock, Unlock } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'status'|'role', user: ... }
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (err) {
      console.warn('[loadUsers error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = (targetUser) => {
    const newStatus = targetUser.status === 'blocked' ? 'active' : 'blocked';
    setConfirmAction({
      type: 'status',
      user: targetUser,
      newStatus,
      title: newStatus === 'blocked' ? `Block ${targetUser.name || 'User'}?` : `Unblock ${targetUser.name || 'User'}?`,
      message: newStatus === 'blocked'
        ? `Are you sure you want to block ${targetUser.email}? They will not be able to access protected dashboard features.`
        : `Are you sure you want to restore access for ${targetUser.email}?`,
      isDanger: newStatus === 'blocked',
    });
  };

  const handleToggleRole = (targetUser) => {
    // Prevent accidental self-demotion
    if (targetUser.uid === currentUser?.uid) {
      toast.error('You cannot change your own admin role');
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setConfirmAction({
      type: 'role',
      user: targetUser,
      newRole,
      title: `Change role to ${newRole.toUpperCase()}?`,
      message: `Are you sure you want to set ${targetUser.email}'s role to ${newRole}?`,
      isDanger: newRole === 'user',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);

    try {
      if (confirmAction.type === 'status') {
        await setUserStatus(confirmAction.user.uid, confirmAction.newStatus);
        await logAdminAction(
          currentUser?.uid || 'admin',
          'UPDATE_USER_STATUS',
          `Changed status of ${confirmAction.user.email} to ${confirmAction.newStatus}`,
          'user',
          confirmAction.user.uid
        );
        toast.success(`User status updated to ${confirmAction.newStatus}`);
      } else if (confirmAction.type === 'role') {
        await setUserRole(confirmAction.user.uid, confirmAction.newRole);
        await logAdminAction(
          currentUser?.uid || 'admin',
          'UPDATE_USER_ROLE',
          `Changed role of ${confirmAction.user.email} to ${confirmAction.newRole}`,
          'user',
          confirmAction.user.uid
        );
        toast.success(`User role updated to ${confirmAction.newRole}`);
      }

      await loadUsers();
      setConfirmAction(null);
      setSelectedUser(null);
    } catch {
      toast.error('Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.name || ''} ${u.email || ''} ${u.primaryRole || ''}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">User Account Management</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Inspect registered users, manage privileges, and enforce account statuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="kc-input-wrapper flex-1 max-w-md">
          <span className="kc-input-icon-left">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="kc-input has-left-icon text-xs sm:text-sm h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="kc-input text-xs h-10 w-auto px-3 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="kc-input text-xs h-10 w-auto px-3 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table / Responsive Card List */}
      <div className="kc-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-kc-muted text-sm">
            No user accounts found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-kc-border bg-kc-surface-2/60 text-kc-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 hidden md:table-cell">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kc-border/60">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.uid} className="hover:bg-kc-surface-2/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar avatarId={userItem.avatarId || 'avatar-01'} size={38} className="shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-kc-text truncate m-0">{userItem.name || 'Developer'}</p>
                          <p className="text-kc-muted truncate m-0">{userItem.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        userItem.role === 'admin'
                          ? 'bg-kc-accent/15 text-kc-accent border border-kc-accent/30'
                          : 'bg-kc-surface-2 text-kc-muted border border-kc-border'
                      }`}>
                        {userItem.role || 'user'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        userItem.status === 'blocked'
                          ? 'bg-kc-danger/15 text-kc-danger border border-kc-danger/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {userItem.status || 'active'}
                      </span>
                    </td>

                    <td className="p-4 text-kc-muted hidden md:table-cell">
                      {formatDate(userItem.createdAt)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(userItem)}
                          className="p-1.5 rounded-lg bg-kc-surface-2 text-kc-muted hover:text-kc-text border border-kc-border hover:border-kc-border-hover transition-colors cursor-pointer"
                          title="View user details"
                          aria-label="View user details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(userItem)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            userItem.status === 'blocked'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-kc-danger/10 text-kc-danger border-kc-danger/30 hover:bg-kc-danger/20'
                          }`}
                          title={userItem.status === 'blocked' ? 'Unblock user' : 'Block user'}
                          aria-label={userItem.status === 'blocked' ? 'Unblock user' : 'Block user'}
                        >
                          {userItem.status === 'blocked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={handleToggleStatus}
        onToggleRole={handleToggleRole}
      />

      {/* Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText="Confirm"
        isDanger={confirmAction?.isDanger}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
export default AdminUsersPage;
