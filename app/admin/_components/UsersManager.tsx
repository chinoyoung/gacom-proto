"use client";

import { useEffect, useState } from "react";
import { getUsers, toggleSuperadmin, deleteUser } from "../_actions";
import { Shield, ShieldAlert, Key, User, Loader2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

type ClerkUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isSuperadmin: boolean;
};

export default function UsersManager() {
    const [users, setUsers] = useState<ClerkUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [deletingUser, setDeletingUser] = useState<ClerkUser | null>(null);
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSuperadmin = async (userId: string, currentStatus: boolean) => {
        setIsUpdating(userId);
        try {
            await toggleSuperadmin(userId, currentStatus);
            await loadUsers(); // Refresh the list
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser || deleteConfirmEmail !== deletingUser.email) return;
        setIsDeleting(true);
        try {
            await deleteUser(deletingUser.id);
            await loadUsers();
            setDeletingUser(null);
            setDeleteConfirmEmail("");
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg leading-6 font-bold text-gray-900">Manage Team Access</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Grant or revoke superadmin privileges for prototype users.
                    </p>
                </div>
                <UsersStats users={users} />
            </div>

            <ul className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                    <li key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-cobalt-100 flex items-center justify-center">
                                        {user.isSuperadmin ? (
                                            <Shield className="w-6 h-6 text-cobalt-600" />
                                        ) : (
                                            <User className="w-6 h-6 text-slate-500" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                        {user.isSuperadmin && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                Superadmin
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeletingUser(user)}
                                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 hover:text-roman-600 hover:border-roman-200 hover:bg-roman-50 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleToggleSuperadmin(user.id, user.isSuperadmin)}
                                    disabled={isUpdating === user.id}
                                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                        ${user.isSuperadmin
                                            ? 'border-roman-200 text-roman-600 bg-white hover:bg-roman-50 hover:border-roman-300 focus:ring-roman-500'
                                            : 'border-transparent text-white bg-slate-800 hover:bg-slate-900 focus:ring-slate-500'
                                        }
                                    `}
                                >
                                    {isUpdating === user.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : user.isSuperadmin ? (
                                        <ShieldAlert className="w-4 h-4" />
                                    ) : (
                                        <Key className="w-4 h-4" />
                                    )}
                                    {user.isSuperadmin ? "Revoke Superadmin" : "Make Superadmin"}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {users.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                            <button
                                onClick={() => {
                                    setDeletingUser(null);
                                    setDeleteConfirmEmail("");
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                            This will permanently delete{" "}
                            <span className="font-bold text-gray-900">
                                {deletingUser.firstName} {deletingUser.lastName}
                            </span>
                            . This action cannot be undone.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Type <span className="font-mono text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-xs">{deletingUser.email}</span> to confirm.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmEmail}
                            onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-roman-500 focus:border-roman-500 mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setDeletingUser(null);
                                    setDeleteConfirmEmail("");
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={deleteConfirmEmail !== deletingUser.email || isDeleting}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-roman-500 text-white text-sm font-bold rounded-lg hover:bg-roman-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UsersStats({ users }: { users: ClerkUser[] }) {
    const totalUsers = users.length;
    const superadmins = users.filter((u) => u.isSuperadmin).length;

    return (
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Users</span>
                <span className="text-xl font-bold text-gray-900">{totalUsers}</span>
            </div>
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Superadmins</span>
                <span className="text-xl font-bold text-cobalt-600">{superadmins}</span>
            </div>
        </div>
    );
}
