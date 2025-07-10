import React, { useState, Fragment, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchAllUsers, fetchProjectsByIds } from "../api";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { User, Briefcase, Calendar, Workflow, AlertTriangle, CheckCircle } from "lucide-react";
<<<<<<< HEAD
import { motion } from 'framer-motion';
=======
>>>>>>> origin

const TASK_STATUS_OPTIONS = ["To Do", "In Progress", "Done", "Blocked"];
const DESCRIPTION_MAX_LENGTH = 500;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// A reusable Toast Notification component
<<<<<<< HEAD
const Notification = ({ show, onHide, message, type }) => {
  if (!show) return null;

  const baseClasses = "fixed top-20 right-5 w-full max-w-sm p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 ease-in-out z-50";
=======
// A reusable Toast Notification component
const Notification = ({ show, onHide, message, type }) => {
  if (!show) return null;

  // Added z-50 to ensure it appears above the navbar
  const baseClasses = "fixed top-5 right-5 w-full max-w-sm p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 ease-in-out z-50";
>>>>>>> origin
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
  };
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={onHide} className="inline-flex rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

// A reusable Skeleton Loader component
const SkeletonLoader = () => (
<<<<<<< HEAD
    <div className="w-full p-4 border border-border bg-secondary rounded-md shadow">
        <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-muted-foreground/50 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-muted-foreground/50 rounded col-span-2"></div>
                    <div className="h-2 bg-muted-foreground/50 rounded col-span-1"></div>
=======
    <div className="w-full p-4 border border-gray-200 rounded-md shadow">
        <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
>>>>>>> origin
                </div>
            </div>
        </div>
    </div>
);


export default function CreateTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    "Task Name": "",
    "Project": null,
    "Assigned To": null,
    "Due Date": "",
    "Status": "To Do",
    "Description": "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const createdByUserId = localStorage.getItem("userRecordId") || "";
  
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
  });
  
  const projectIds = JSON.parse(localStorage.getItem("projectIds") || "[]");
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", projectIds],
    queryFn: () => fetchProjectsByIds(projectIds),
    enabled: projectIds.length > 0,
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) => createTask({
      ...taskData,
      "Project": taskData["Project"]?.id,
      "Assigned To": taskData["Assigned To"]?.id,
      "Created By": createdByUserId,
    }),
    onSuccess: (newTask) => {
      const prevCreatedTaskIds = JSON.parse(localStorage.getItem("createdTaskIds") || "[]");
      const newCreatedTaskIds = [...new Set([...prevCreatedTaskIds, newTask.id])];
      localStorage.setItem("createdTaskIds", JSON.stringify(newCreatedTaskIds));
      
<<<<<<< HEAD
=======
      const assignedToUser = fields["Assigned To"];
      if (assignedToUser) {
          const prevAssignedTasks = JSON.parse(localStorage.getItem(`assignedTaskIds_${assignedToUser.id}`) || "[]");
          const newAssignedTasks = [...new Set([...prevAssignedTasks, newTask.id])];
          localStorage.setItem(`assignedTaskIds_${assignedToUser.id}`, JSON.stringify(newAssignedTasks));
      }

>>>>>>> origin
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminCreatedTasks'] });
      
      setNotification({ show: true, message: "Task created successfully!", type: 'success' });
<<<<<<< HEAD
      setTimeout(() => navigate('/my-tasks'), 2000);
=======
      setTimeout(() => navigate('/admin-tasks'), 2000);
>>>>>>> origin
    },
    onError: (err) => {
      setNotification({ show: true, message: err.message || "Failed to create task.", type: 'error' });
    }
  });

  const validateField = (name, value) => {
    if (!value) {
<<<<<<< HEAD
      return `${name.replace(/([A-Z])/g, ' $1').trim()} is required.`;
=======
      return `${name} is required.`;
>>>>>>> origin
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    const requiredFields = ["Task Name", "Project", "Assigned To", "Due Date"];
    let hasErrors = false;
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!fields[field]) {
<<<<<<< HEAD
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required.`;
=======
        newErrors[field] = `${field} is required.`;
>>>>>>> origin
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      setNotification({ show: true, message: 'Please fill out all required fields.', type: 'error' });
      return;
    }
    
    createTaskMutation.mutate(fields);
  };

  return (
    <>
      <Notification 
        show={notification.show}
        onHide={() => setNotification(prev => ({...prev, show: false}))}
        message={notification.message}
        type={notification.type}
      />
<<<<<<< HEAD
      <div className="min-h-screen bg-card flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full space-y-8"
        >
          <div className="text-center">
             <h2 className="text-4xl font-light text-foreground">
                Create a New Task
              </h2>
            <p className="mt-2 text-lg text-muted-foreground">
=======
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
             <h2 className="text-4xl font-extrabold text-gray-900">
                Create a New Task
              </h2>
            <p className="mt-2 text-lg text-gray-600">
>>>>>>> origin
              Delegate responsibilities and keep your projects on track.
            </p>
          </div>
          
<<<<<<< HEAD
          <div className="bg-[#333333] p-10 rounded-2xl border border-border">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="task-name" className="block text-sm font-light text-muted-foreground mb-1">Task Name</label>
=======
          <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
>>>>>>> origin
                <input
                  id="task-name"
                  name="Task Name"
                  required
                  type="text"
                  placeholder="e.g., Draft Q3 marketing report"
<<<<<<< HEAD
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors['Task Name'] ? 'border-red-500' : 'border-border'} bg-secondary placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
=======
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors['Task Name'] ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
>>>>>>> origin
                  value={fields["Task Name"]}
                  onChange={e => setFields(f => ({ ...f, "Task Name": e.target.value }))}
                  onBlur={handleBlur}
                />
<<<<<<< HEAD
                {errors['Task Name'] && <p className="mt-2 text-sm text-red-500">{errors['Task Name']}</p>}
=======
                {errors['Task Name'] && <p className="mt-2 text-sm text-red-600">{errors['Task Name']}</p>}
>>>>>>> origin
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {usersLoading ? <SkeletonLoader /> : (
                  <Listbox value={fields["Assigned To"]} onChange={value => setFields(f => ({ ...f, "Assigned To": value }))}>
                    <div>
<<<<<<< HEAD
                      <Listbox.Label className="block text-sm font-light text-muted-foreground">Assign To</Listbox.Label>
                      <div className="mt-1 relative">
                        <Listbox.Button className={`relative w-full bg-secondary border ${errors['Assigned To'] ? 'border-red-500' : 'border-border'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}>
                          <span className="flex items-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="ml-3 block truncate text-foreground">{fields["Assigned To"] ? fields["Assigned To"].fields["User Name"] : "Select a user"}</span>
                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-secondary shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {users.map(user => (
                              <Listbox.Option key={user.id} className={({ active }) => classNames(active ? 'text-white bg-primary/20' : 'text-foreground', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={user}>
                                {({ selected, active }) => (
                                  <>
                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{user.fields["User Name"]}</span>
                                    {selected ? (<span className={classNames(active ? 'text-white' : 'text-accent', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
=======
                      <Listbox.Label className="block text-sm font-medium text-gray-700">Assign To</Listbox.Label>
                      <div className="mt-1 relative">
                        <Listbox.Button className={`relative w-full bg-white border ${errors['Assigned To'] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}>
                          <span className="flex items-center">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="ml-3 block truncate">{fields["Assigned To"] ? fields["Assigned To"].fields["User Name"] : "Select a user"}</span>
                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {users.map(user => (
                              <Listbox.Option key={user.id} className={({ active }) => classNames(active ? 'text-white bg-gray-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={user}>
                                {({ selected, active }) => (
                                  <>
                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{user.fields["User Name"]}</span>
                                    {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
>>>>>>> origin
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
<<<<<<< HEAD
                        {errors['Assigned To'] && <p className="mt-2 text-sm text-red-500">{errors['Assigned To']}</p>}
=======
                        {errors['Assigned To'] && <p className="mt-2 text-sm text-red-600">{errors['Assigned To']}</p>}
>>>>>>> origin
                      </div>
                    </div>
                  </Listbox>
                )}
                
                {projectsLoading ? <SkeletonLoader /> : (
                  <Listbox value={fields["Project"]} onChange={value => setFields(f => ({ ...f, "Project": value }))}>
                    <div>
<<<<<<< HEAD
                      <Listbox.Label className="block text-sm font-light text-muted-foreground">Project</Listbox.Label>
                      <div className="mt-1 relative">
                        <Listbox.Button className={`relative w-full bg-secondary border ${errors['Project'] ? 'border-red-500' : 'border-border'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}>
                          <span className="flex items-center">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <span className="ml-3 block truncate text-foreground">{fields["Project"] ? fields["Project"].fields["Project Name"] : "Select a project"}</span>
                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-secondary shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {projects.map(project => (
                              <Listbox.Option key={project.id} className={({ active }) => classNames(active ? 'text-white bg-primary/20' : 'text-foreground', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={project}>
                                {({ selected, active }) => (
                                  <>
                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{project.fields["Project Name"]}</span>
                                    {selected ? (<span className={classNames(active ? 'text-white' : 'text-accent', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
=======
                      <Listbox.Label className="block text-sm font-medium text-gray-700">Project</Listbox.Label>
                      <div className="mt-1 relative">
                        <Listbox.Button className={`relative w-full bg-white border ${errors['Project'] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}>
                          <span className="flex items-center">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <span className="ml-3 block truncate">{fields["Project"] ? fields["Project"].fields["Project Name"] : "Select a project"}</span>
                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {projects.map(project => (
                              <Listbox.Option key={project.id} className={({ active }) => classNames(active ? 'text-white bg-gray-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={project}>
                                {({ selected, active }) => (
                                  <>
                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{project.fields["Project Name"]}</span>
                                    {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
>>>>>>> origin
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
<<<<<<< HEAD
                        {errors['Project'] && <p className="mt-2 text-sm text-red-500">{errors['Project']}</p>}
=======
                        {errors['Project'] && <p className="mt-2 text-sm text-red-600">{errors['Project']}</p>}
>>>>>>> origin
                      </div>
                    </div>
                  </Listbox>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
<<<<<<< HEAD
                  <label htmlFor="due-date" className="block text-sm font-light text-muted-foreground">Due Date</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
=======
                  <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
>>>>>>> origin
                    </div>
                    <input
                      id="due-date"
                      name="Due Date"
                      required
                      type="date"
<<<<<<< HEAD
                      className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm ${errors['Due Date'] ? 'border-red-500' : 'border-border'} bg-secondary text-foreground rounded-md`}
=======
                      className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm ${errors['Due Date'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
>>>>>>> origin
                      value={fields["Due Date"]}
                      onChange={e => setFields(f => ({ ...f, "Due Date": e.target.value }))}
                      onBlur={handleBlur}
                    />
                  </div>
<<<<<<< HEAD
                  {errors['Due Date'] && <p className="mt-2 text-sm text-red-500">{errors['Due Date']}</p>}
=======
                  {errors['Due Date'] && <p className="mt-2 text-sm text-red-600">{errors['Due Date']}</p>}
>>>>>>> origin
                </div>

                <Listbox value={fields["Status"]} onChange={value => setFields(f => ({ ...f, "Status": value }))}>
                  <div>
<<<<<<< HEAD
                    <Listbox.Label className="block text-sm font-light text-muted-foreground">Status</Listbox.Label>
                    <div className="mt-1 relative">
                      <Listbox.Button className="relative w-full bg-secondary border border-border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                        <span className="flex items-center">
                          <Workflow className="h-5 w-5 text-muted-foreground" />
                          <span className="ml-3 block truncate text-foreground">{fields["Status"]}</span>
                        </span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-secondary shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {TASK_STATUS_OPTIONS.map(status => (
                            <Listbox.Option key={status} className={({ active }) => classNames(active ? 'text-white bg-primary/20' : 'text-foreground', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={status}>
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{status}</span>
                                  {selected ? (<span className={classNames(active ? 'text-white' : 'text-accent', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
=======
                    <Listbox.Label className="block text-sm font-medium text-gray-700">Status</Listbox.Label>
                    <div className="mt-1 relative">
                      <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <span className="flex items-center">
                          <Workflow className="h-5 w-5 text-gray-400" />
                          <span className="ml-3 block truncate">{fields["Status"]}</span>
                        </span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {TASK_STATUS_OPTIONS.map(status => (
                            <Listbox.Option key={status} className={({ active }) => classNames(active ? 'text-white bg-gray-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={status}>
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{status}</span>
                                  {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
>>>>>>> origin
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </div>
                </Listbox>
              </div>

              <div>
<<<<<<< HEAD
                <label htmlFor="description" className="block text-sm font-light text-muted-foreground">Description</label>
=======
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
>>>>>>> origin
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows="4"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Add a detailed description for the task..."
<<<<<<< HEAD
                    className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-border bg-secondary rounded-md p-2 text-foreground placeholder-muted-foreground"
=======
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
>>>>>>> origin
                    value={fields["Description"]}
                    onChange={e => setFields(f => ({ ...f, "Description": e.target.value }))}
                  />
                </div>
<<<<<<< HEAD
                <p className="mt-2 text-sm text-muted-foreground text-right">{fields["Description"].length} / {DESCRIPTION_MAX_LENGTH}</p>
=======
                <p className="mt-2 text-sm text-gray-500 text-right">{fields["Description"].length} / {DESCRIPTION_MAX_LENGTH}</p>
>>>>>>> origin
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
<<<<<<< HEAD
                  disabled={createTaskMutation.isPending || usersLoading || projectsLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                >
                  {createTaskMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
=======
                  disabled={createTaskMutation.isLoading || usersLoading || projectsLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                >
                  {createTaskMutation.isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
>>>>>>> origin
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Task...
                    </>
                  ) : "Create & Assign Task"}
                </button>
              </div>
            </form>
          </div>
<<<<<<< HEAD
        </motion.div>
      </div>
    </>
  );
}
=======
        </div>
      </div>
    </>
  );
}
>>>>>>> origin
