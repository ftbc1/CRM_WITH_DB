import React, { useState, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchAllUsers, fetchProjectsByIds, updateUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { User, Briefcase, Calendar } from "lucide-react";

const TASK_STATUS_OPTIONS = ["To Do", "In Progress", "Done", "Blocked"];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
  const [error, setError] = useState("");

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
      
      const assignedToUser = fields["Assigned To"];
      if (assignedToUser) {
          const prevAssignedTasks = JSON.parse(localStorage.getItem(`assignedTaskIds_${assignedToUser.id}`) || "[]");
          const newAssignedTasks = [...new Set([...prevAssignedTasks, newTask.id])];
          localStorage.setItem(`assignedTaskIds_${assignedToUser.id}`, JSON.stringify(newAssignedTasks));
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminCreatedTasks'] });
      navigate('/admin-tasks');
    },
    onError: (err) => {
      setError(err.message || "Failed to create task. Please try again.");
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fields["Task Name"] || !fields["Project"] || !fields["Assigned To"] || !fields["Due Date"]) {
      setError("Please fill out all required fields.");
      return;
    }
    createTaskMutation.mutate(fields);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a New Task
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Assign and track work for your team members.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative border border-gray-300 rounded-t-md px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
              <label htmlFor="task-name" className="block text-xs font-medium text-gray-700">Task Name</label>
              <input
                id="task-name"
                required
                type="text"
                placeholder="e.g., Draft Q3 marketing report"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                value={fields["Task Name"]}
                onChange={e => setFields(f => ({ ...f, "Task Name": e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Listbox value={fields["Assigned To"]} onChange={value => setFields(f => ({ ...f, "Assigned To": value }))}>
              {({ open }) => (
                <div>
                  <Listbox.Label className="block text-sm font-medium text-gray-700">Assign To</Listbox.Label>
                  <div className="mt-1 relative">
                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="flex items-center">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 block truncate">{fields["Assigned To"] ? fields["Assigned To"].fields["User Name"] : "Select a user"}</span>
                      </span>
                      <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {users.map(user => (
                          <Listbox.Option key={user.id} className={({ active }) => classNames(active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={user}>
                            {({ selected, active }) => (
                              <>
                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{user.fields["User Name"]}</span>
                                {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </div>
              )}
            </Listbox>

            <Listbox value={fields["Project"]} onChange={value => setFields(f => ({ ...f, "Project": value }))}>
              {({ open }) => (
                <div>
                  <Listbox.Label className="block text-sm font-medium text-gray-700">Project</Listbox.Label>
                  <div className="mt-1 relative">
                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 block truncate">{fields["Project"] ? fields["Project"].fields["Project Name"] : "Select a project"}</span>
                      </span>
                      <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {projects.map(project => (
                          <Listbox.Option key={project.id} className={({ active }) => classNames(active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={project}>
                            {({ selected, active }) => (
                              <>
                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{project.fields["Project Name"]}</span>
                                {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </div>
              )}
            </Listbox>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="due-date"
                  required
                  type="date"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={fields["Due Date"]}
                  onChange={e => setFields(f => ({ ...f, "Due Date": e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                value={fields["Status"]}
                onChange={e => setFields(f => ({ ...f, "Status": e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {TASK_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <div className="mt-1">
              <textarea
                id="description"
                rows="4"
                placeholder="Add a detailed description for the task..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                value={fields["Description"]}
                onChange={e => setFields(f => ({ ...f, "Description": e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={createTaskMutation.isLoading || usersLoading || projectsLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {createTaskMutation.isLoading ? "Creating Task..." : "Create & Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
