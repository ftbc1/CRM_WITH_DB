import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasksByCreator } from '../api';
import { PlusIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function AdminMyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        // Using secretKey as it's the unique identifier the backend expects for creators
        const userSecretKey = localStorage.getItem('secretKey'); 
        if (!userSecretKey) {
          throw new Error("Admin user key not found in local storage.");
        }
        const fetchedTasks = await fetchTasksByCreator(userSecretKey);
        setTasks(fetchedTasks);
        setError('');
      } catch (err) {
        console.error("Error fetching admin's created tasks:", err);
        setError('Failed to load your created tasks.');
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-lg text-muted-foreground">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-light text-foreground">My Created Tasks</h1>
            <p className="text-muted-foreground mt-1">A list of all tasks you have created and assigned.</p>
        </div>
        <Link
            to="/admin/create-task"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 font-semibold shadow-sm transition-colors"
        >
            <PlusIcon className="h-5 w-5" />
            Create New Task
        </Link>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-[#333333] p-5 rounded-2xl shadow border border-border flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <div>
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-light mb-2 text-foreground">{task.fields['Task Name']}</h2>
                    <p className={`px-2 py-1 text-xs rounded-full inline-block ${
                    task.fields.Status === 'Done' ? 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/20' :
                    task.fields.Status === 'In Progress' ? 'bg-yellow-400/10 text-yellow-400 ring-1 ring-inset ring-yellow-400/20' :
                    'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/20'
                    }`}>
                    {task.fields.Status || 'To-Do'}
                    </p>
                </div>
                <div className="text-sm text-muted-foreground space-y-2 mb-4 mt-2">
                    <p className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Assigned to: <span className="font-medium text-foreground ml-1">{task.fields['Assigned To (Name)'] || 'Unassigned'}</span></span>
                    </p>
                    <p className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Due Date: {task.fields['Due Date'] ? new Date(task.fields['Due Date']).toLocaleDateString() : 'Not set'}</span>
                    </p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Link to={`/admin/tasks/${task.id}`} className="text-sm font-light text-accent hover:underline">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#333333] rounded-2xl border border-border">
          <h2 className="text-xl font-light text-foreground">No tasks found</h2>
          <p className="text-muted-foreground mt-2">You have not created any tasks yet. Get started by creating one.</p>
        </div>
      )}
    </div>
  );
}