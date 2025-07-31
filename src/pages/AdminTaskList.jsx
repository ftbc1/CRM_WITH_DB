import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllTasksForAdmin } from '../api';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await fetchAllTasksForAdmin();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching all tasks:", err);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-light text-foreground">Manage Tasks</h1>
                <p className="text-muted-foreground mt-1">A list of all tasks across all projects.</p>
            </div>
            <Link
                to="/admin/create-task"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 font-semibold shadow-sm transition-colors"
            >
                <PlusIcon className="h-5 w-5" />
                Create Task
            </Link>
        </div>
      
        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Task Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Project</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Assigned To</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Due Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                    {loading ? (
                        <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">Loading tasks...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="5" className="py-8 text-center text-red-500">{error}</td></tr>
                    ) : tasks.length > 0 ? (
                        tasks.map(task => (
                        <tr key={task.id} className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/tasks/${task.id}`)}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{task.fields['Task Name']}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Project Name'] || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Assigned To (Name)'] || 'Unassigned'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                                task.fields.Status === 'Done' ? 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/20' :
                                task.fields.Status === 'In Progress' ? 'bg-yellow-400/10 text-yellow-400 ring-1 ring-inset ring-yellow-400/20' :
                                'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/20'
                                }`}>
                                {task.fields.Status || 'To-Do'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                            {task.fields['Due Date'] ? new Date(task.fields['Due Date']).toLocaleDateString() : 'Not set'}
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">No tasks found.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}