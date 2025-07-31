import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTaskById } from '../api';
import { CalendarIcon, UserIcon, PencilIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminTaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true);
        const fetchedTask = await fetchTaskById(taskId);
        if (!fetchedTask) {
          throw new Error('Task not found.');
        }
        setTask(fetchedTask);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    getTaskDetails();
  }, [taskId]);

  if (loading) {
    return <div className="text-center py-20 text-lg text-muted-foreground">Loading task details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }

  if (!task) {
    return <div className="text-center p-4 text-muted-foreground">Task not found.</div>;
  }

  const { fields } = task;
  const assignedTo = fields['Assigned To (Name)'] ? fields['Assigned To (Name)'][0] : 'Unassigned';
  const createdBy = fields['Created By (Name)'] ? fields['Created By (Name)'][0] : 'Unknown';
  const projectName = fields['Project Name']?.[0] || 'N/A';
  const projectId = fields.Project?.[0];

  return (
    <div>
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center">
            <li className="flex items-center">
                <Link to="/admin/projects" className="hover:text-accent transition-colors">Projects</Link>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
            </li>
            {projectId && (
                <li className="flex items-center">
                    <Link to={`/admin/projects/${projectId}`} className="hover:text-accent transition-colors truncate max-w-[200px]">{projectName}</Link>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
                </li>
            )}
            <li>
                <span className="font-semibold text-foreground">Task</span>
            </li>
            </ol>
        </nav>

      <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
          <h1 className="text-3xl lg:text-4xl font-light text-foreground tracking-tight">
            {fields['Task Name']}
          </h1>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full self-start ${
            fields.Status === 'Done' ? 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/20' :
            fields.Status === 'In Progress' ? 'bg-yellow-400/10 text-yellow-400 ring-1 ring-inset ring-yellow-400/20' :
            'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/20'
          }`}>
            {fields.Status || 'To-Do'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground py-6">
          <div className="flex items-start space-x-3">
            <UserIcon className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
            <div>
                <p className="font-light text-muted-foreground">Assigned To</p>
                <p className="font-medium text-foreground mt-1">{assignedTo}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <PencilIcon className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
             <div>
                <p className="font-light text-muted-foreground">Created By</p>
                <p className="font-medium text-foreground mt-1">{createdBy}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
            <div>
                <p className="font-light text-muted-foreground">Due Date</p>
                <p className="font-medium text-foreground mt-1">{fields['Due Date'] ? new Date(fields['Due Date']).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
        </div>

        {fields.Description && (
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-light text-foreground mb-3">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed font-light">
              {fields.Description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}