import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { createTask, fetchAllUsersForAdmin, fetchAllProjectsForAdmin } from '../api';

export default function AdminCreateTask() {
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  const assignedToUserAirtableId = useWatch({
    control,
    name: "assignedToId",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchAllUsersForAdmin();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to load users for form", err);
        setError("Could not load the list of users.");
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchProjectsForUser = async () => {
      if (!assignedToUserAirtableId) {
        setProjects([]);
        setValue('projectId', '');
        return;
      }
      
      try {
        setIsProjectsLoading(true);
        setError(null);
        setValue('projectId', '');

        const selectedUser = users.find(u => u.fields['Secret Key'] === assignedToUserAirtableId);
        if (!selectedUser) {
            setProjects([]);
            return;
        };

        const userInternalId = selectedUser.id;
        
        const fetchedProjects = await fetchAllProjectsForAdmin({ ownerId: userInternalId });
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Failed to load projects for user", err);
        setError("Could not load projects for the selected user.");
        setProjects([]);
      } finally {
        setIsProjectsLoading(false);
      }
    };

    fetchProjectsForUser();
  }, [assignedToUserAirtableId, users, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    const adminAirtableId = localStorage.getItem('secretKey');

    const taskData = {
      "Task Name": data.taskName,
      "Description": data.description,
      "Project": data.projectId,
      "Assigned To": data.assignedToId,
      "Due Date": data.dueDate,
      "Status": data.status,
      "Created By": adminAirtableId,
    };
    
    try {
      await createTask(taskData);
      navigate('/admin/tasks');
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("An error occurred while creating the task. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
          <h2 className="text-4xl font-light text-foreground">
            Create a New Task
          </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Delegate responsibilities and keep projects on track.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#333333] p-10 rounded-2xl border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-3 rounded-md">{error}</div>}
            
            <div>
                <label htmlFor="taskName" className="block text-sm font-light text-muted-foreground mb-1">Task Name</label>
                <input type="text" {...register("taskName", { required: "Task name is required" })} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
                {errors.taskName && <p className="mt-2 text-sm text-red-500">{errors.taskName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="assignedToId" className="block text-sm font-light text-muted-foreground mb-1">Assign To</label>
                    <select {...register("assignedToId", { required: "You must assign the task to a user" })} className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                        <option value="">Select a user...</option>
                        {users.map(user => <option key={user.id} value={user.fields['Secret Key']}>{user.fields['User Name']}</option>)}
                    </select>
                    {errors.assignedToId && <p className="mt-2 text-sm text-red-500">{errors.assignedToId.message}</p>}
                </div>
                <div>
                    <label htmlFor="projectId" className="block text-sm font-light text-muted-foreground mb-1">Project</label>
                    <select 
                        {...register("projectId", { required: "You must link the task to a project" })} 
                        className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!assignedToUserAirtableId || isProjectsLoading}
                    >
                        <option value="">
                            {!assignedToUserAirtableId 
                                ? "Select a user first" 
                                : isProjectsLoading 
                                ? "Loading projects..." 
                                : projects.length > 0
                                ? "Select a project..."
                                : "No projects for this user"}
                        </option>
                        {projects.map(project => <option key={project.id} value={project.id}>{project.fields['Project Name']}</option>)}
                    </select>
                    {errors.projectId && <p className="mt-2 text-sm text-red-500">{errors.projectId.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label htmlFor="status" className="block text-sm font-light text-muted-foreground mb-1">Status</label>
                    <select {...register("status")} defaultValue="To Do" className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-light text-muted-foreground mb-1">Due Date</label>
                    <input type="date" {...register("dueDate")} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-light text-muted-foreground mb-1">Description</label>
                <textarea {...register("description")} rows={4} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
            </div>

            <div className="flex items-center justify-end gap-x-6 pt-4">
                <button type="button" onClick={() => navigate('/admin/tasks')} className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}