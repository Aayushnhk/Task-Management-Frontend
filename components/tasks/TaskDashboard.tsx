"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, Task, TaskResponse, deleteTask } from '@/services/taskService';
import { useNotification } from '@/components/notifications/NotificationContext';
import TaskList from './TaskList';
import TaskFilters from './TaskFilters';
import TaskFormModal from './TaskFormModal';
import ConfirmationModal from './ConfirmationModal';

export default function TaskDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [metadata, setMetadata] = useState<TaskResponse['metadata'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Delete Confirmation State
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        taskId: string | null;
        taskTitle: string | null;
    }>({
        isOpen: false,
        taskId: null,
        taskTitle: null,
    });

    const router = useRouter();
    const { notify } = useNotification();

    const fetchTasks = useCallback(async (page: number, status: string, search: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                page,
                limit: 10,
                status: status || undefined,
                search: search || undefined,
            };
            const data = await getTasks(params);
            setTasks(data.tasks);
            setMetadata(data.metadata);
        } catch (err: any) {
            if (err.message.includes('expired') || err.message.includes('Unauthorized')) {
                router.push('/login');
            } else {
                setError(err.message || 'Failed to load tasks.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchTasks(currentPage, filterStatus, searchTerm);
    }, [currentPage, filterStatus, searchTerm, fetchTasks]);

    const handleAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleTaskOperationComplete = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        fetchTasks(currentPage, filterStatus, searchTerm);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    };

    // Delete Confirmation Handlers
    const openDeleteConfirm = (id: string, title: string) => {
        setDeleteConfirm({ isOpen: true, taskId: id, taskTitle: title });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: null });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.taskId || !deleteConfirm.taskTitle) return;

        try {
            await deleteTask(deleteConfirm.taskId);
            fetchTasks(currentPage, filterStatus, searchTerm);
            notify(`Task "${deleteConfirm.taskTitle}" deleted successfully.`, 'success');
        } catch (err: any) {
            notify(err.message || 'Failed to delete task.', 'error');
        } finally {
            closeDeleteConfirm();
        }
    };

    return (
        <div className="bg-linear-to-br from-slate-900 via-gray-900 to-slate-900 overflow-y-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Task Manager
                            </h1>
                            <p className="text-gray-400 mt-1">Stay organized, stay productive</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Task
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Sidebar: Stats */}
                    <aside className="xl:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-200 mb-5">Overview</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                                    <span className="text-gray-400">Total Tasks</span>
                                    <span className="text-2xl font-bold text-white">{metadata?.totalTasks || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-emerald-900/20 rounded-xl border border-emerald-700/30">
                                    <span className="text-gray-400">Completed</span>
                                    <span className="text-2xl font-bold text-emerald-400">
                                        {tasks.filter(t => t.status === 'completed').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-amber-900/20 rounded-xl border border-amber-700/30">
                                    <span className="text-gray-300">Pending</span>
                                    <span className="text-2xl font-bold text-amber-400">
                                        {tasks.filter(t => t.status === 'pending').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="xl:col-span-3 space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5 shadow-xl">
                            <TaskFilters
                                filterStatus={filterStatus}
                                setFilterStatus={setFilterStatus}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 flex items-center gap-3">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                            <TaskList
                                tasks={tasks}
                                isLoading={isLoading}
                                onEdit={handleEditTask}
                                refetchTasks={handleTaskOperationComplete}
                                onDeleteClick={openDeleteConfirm}  
                            />
                        </div>

                        {metadata && metadata.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1 || isLoading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>

                                <span className="px-4 py-2 bg-violet-900/40 text-violet-300 rounded-xl border border-violet-700/50 text-sm font-medium">
                                    Page {currentPage} of {metadata.totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(metadata.totalPages, prev + 1))}
                                    disabled={currentPage === metadata.totalPages || isLoading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </main>
                </div>

                <TaskFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={editingTask}
                    onSuccess={handleTaskOperationComplete}
                />

                <ConfirmationModal
                    isOpen={deleteConfirm.isOpen}
                    onClose={closeDeleteConfirm}
                    onConfirm={confirmDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to permanently delete the task: "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
                />
            </div>
        </div>
    );
}