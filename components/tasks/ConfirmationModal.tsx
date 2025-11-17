"use client";
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 transform transition-all duration-300">
                <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl border border-red-500/20 mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white text-center mb-3">{title}</h3>
                    
                    <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-base font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-600/50 backdrop-blur-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-6 py-3 text-base font-medium text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 backdrop-blur-sm"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}