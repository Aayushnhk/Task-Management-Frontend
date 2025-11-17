// services/taskService.ts

import { apiClient } from './apiClient';

// Define Task structure for TypeScript clarity
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Define structure for the API response
export interface TaskResponse {
  tasks: Task[];
  metadata: {
    totalTasks: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Define the query parameters
interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

/**
 * Fetches the list of tasks from the protected backend API.
 */
export const getTasks = async (params: GetTasksParams): Promise<TaskResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  const queryString = query.toString() ? `?${query.toString()}` : '';

  const response = await apiClient(`tasks${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks.');
  }

  return response.json();
};

// CREATE TASK
export const createTask = async (title: string, description: string): Promise<Task> => { 
    const response = await apiClient('tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task.');
    }
    return response.json();
};

// UPDATE TASK
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient(`tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task.');
    }
    return response.json();
};

// DELETE TASK
export const deleteTask = async (id: string): Promise<void> => {
    const response = await apiClient(`tasks/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        return; // Success (No Content)
    }

    if (!response.ok) {
        // Attempt to parse error if not 204, but expect 204 from backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task.');
    }
};

// TOGGLE TASK STATUS
export const toggleTaskStatus = async (id: string): Promise<Task> => { 
    const response = await apiClient(`tasks/${id}/toggle`, {
        method: 'PATCH',
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle task status.');
    }
    return response.json();
};