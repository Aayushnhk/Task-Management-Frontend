"use client";
import React from 'react';
import { Task, toggleTaskStatus } from '@/services/taskService';
import { useNotification } from '@/components/notifications/NotificationContext';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    refetchTasks: () => void;
    onEdit: (task: Task) => void;
    onDeleteClick: (id: string, title: string) => void;
}

export default function TaskList({ tasks, isLoading, refetchTasks, onEdit, onDeleteClick }: TaskListProps) {
    const { notify } = useNotification();

    const handleToggle = async (id: string, title: string) => {
        try {
            const updatedTask = await toggleTaskStatus(id);
            refetchTasks();
            const statusMsg = updatedTask.status === 'completed' ? 'completed' : 'pending';
            notify(`Task "${title}" marked as ${statusMsg}.`, 'success');
        } catch (err: any) {
            notify(err.message || 'Failed to toggle status.', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-gray-300 font-semibold text-lg">Loading your tasks</p>
                    <p className="text-gray-500 text-sm">Getting everything ready for you...</p>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-32 h-32 bg-linear-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">No tasks yet</h3>
                <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                    Ready to get organized? Create your first task and start managing your work efficiently.
                </p>
                <div className="mt-6 p-4 bg-linear-to-r from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/50">
                    <p className="text-gray-400 text-sm">
                        Tip: Click the "Add New Task" button above to get started
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-700/50">
            {tasks.map((task, index) => (
                <div 
                    key={task.id} 
                    className={`p-6 transition-all duration-300 hover:bg-gray-750/30 group ${
                        task.status === 'completed' 
                            ? 'bg-linear-to-r from-green-900/10 to-emerald-900/5' 
                            : 'bg-linear-to-r from-gray-800/50 to-gray-800/30'
                    } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                        index === tasks.length - 1 ? 'rounded-b-2xl' : ''
                    }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start space-x-4">
                                <button
                                    onClick={() => handleToggle(task.id, task.title)}
                                    className={`mt-1.5 shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                                        task.status === 'completed' 
                                            ? 'bg-linear-to-br from-green-500 to-emerald-500 border-green-500 shadow-lg shadow-green-500/25' 
                                            : 'border-gray-500 hover:border-green-400 bg-gray-700/50 shadow-inner'
                                    }`}
                                >
                                    {task.status === 'completed' && (
                                        <svg className="w-3.5 h-3.5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 
                                            className={`text-xl font-semibold cursor-pointer transition-all duration-300 leading-tight ${
                                                task.status === 'completed' 
                                                    ? 'line-through text-gray-500' 
                                                    : 'text-gray-200 hover:text-white'
                                            }`}
                                            onClick={() => handleToggle(task.id, task.title)}
                                        >
                                            {task.title}
                                        </h3>
                                        
                                        <span className={`hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${
                                            task.status === 'completed' 
                                                ? 'bg-green-900/40 text-green-300 border-green-700/50' 
                                                : 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50'
                                        }`}>
                                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </span>
                                    </div>
                                    
                                    {task.description && (
                                        <p className="text-gray-400 text-base leading-relaxed">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <span className={`sm:hidden px-2.5 py-1 text-xs font-semibold rounded-full border ${
                                task.status === 'completed' 
                                    ? 'bg-green-900/40 text-green-300 border-green-700/50' 
                                    : 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50'
                            }`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                            
                            <button 
                                onClick={() => onEdit(task)} 
                                className="p-2.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/40 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm cursor-pointer"
                                title="Edit task"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            
                            <button 
                                onClick={() => onDeleteClick(task.id, task.title)} 
                                className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/40 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm cursor-pointer"
                                title="Delete task"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2.171 2.171 0 0116.138 21H7.862a2.171 2.171 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}