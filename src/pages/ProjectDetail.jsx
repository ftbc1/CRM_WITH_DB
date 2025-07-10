import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectById, fetchUpdatesByIds, updateRecord, fetchTasksByIds } from "../api";
import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
<<<<<<< HEAD
import { CheckIcon, ChevronUpDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
=======
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
>>>>>>> origin

const PROJECT_STATUS_OPTIONS = [
  "Negotiation",
  "Need Analysis",
  "Closed Won",
  "Closed Lost",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProjectDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [fields, setFields] = useState({
    "Project Status": "",
    "Start Date": "",
    "End Date": "",
    "Project Value": "",
    "Project Description": "",
  });

  const { data: project, isLoading, error: fetchError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (project?.fields) {
      setFields({
        "Project Status": project.fields["Project Status"] || "",
        "Start Date": project.fields["Start Date"] || "",
        "End Date": project.fields["End Date"] || "",
        "Project Value": project.fields["Project Value"] || "",
        "Project Description": project.fields["Project Description"] || "",
      });
    }
  }, [project]);

<<<<<<< HEAD
  const { mutate: updateProject, isPending: isUpdating, isSuccess, error: updateError } = useMutation({
    mutationFn: (updatedFields) => updateRecord("Projects", id, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["project", id]});
      setTimeout(() => {
        queryClient.setQueryData(["project", id], (oldData) => {
            if (oldData) {
                const newData = { ...oldData };
                delete newData.isSuccess;
                return newData;
            }
            return oldData;
        });
=======
  const { mutate: updateProject, isLoading: isUpdating, isSuccess, error: updateError } = useMutation({
    mutationFn: (updatedFields) => updateRecord("Projects", id, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries(["project", id]);
      setTimeout(() => {
        queryClient.setQueryData(["project", id], (oldData) => ({...oldData, isSuccess: false}))
>>>>>>> origin
      }, 3000);
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const numericValue = fields["Project Value"] ? Number(fields["Project Value"]) : undefined;
    updateProject({
        ...fields,
        "Project Value": numericValue,
    });
  };

  const updateIds = project?.fields?.Updates || [];
  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ["projectUpdates", updateIds],
    queryFn: () => fetchUpdatesByIds(updateIds),
    enabled: updateIds.length > 0,
  });

  const taskIds = useMemo(() => {
    if (!updates) return [];
    const ids = updates.map((u) => u.fields.Task?.[0]).filter(Boolean);
    return [...new Set(ids)];
  }, [updates]);

  const { data: tasks } = useQuery({
    queryKey: ["tasksForProjectUpdates", taskIds],
    queryFn: () => fetchTasksByIds(taskIds),
    enabled: taskIds.length > 0,
  });

  const taskIdToName = useMemo(() => {
    if (!tasks) return {};
    return tasks.reduce((acc, task) => {
      acc[task.id] = task.fields["Task Name"] || task.id;
      return acc;
    }, {});
  }, [tasks]);


<<<<<<< HEAD
  if (isLoading) return <div className="text-center py-20 text-lg text-muted-foreground">Loading project details...</div>;
  if (fetchError) return <div className="text-red-500 text-center py-10">Error loading project: {fetchError.message}</div>;
  if (!project) return <div className="text-center py-10 text-muted-foreground">No project data found.</div>;

  const name = project.fields["Project Name"] || "Unnamed Project";
  const accountName = project.fields["Account Name (from Account)"]?.[0] || "N/A";
  const accountId = project.fields.Account?.[0];

  return (
    <div className="min-h-screen bg-card w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center">
                    <li className="flex items-center">
                        <Link to="/projects" className="hover:text-accent transition-colors">Projects</Link>
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
                    </li>
                    <li>
                        <span className="font-semibold text-foreground">{name}</span>
                    </li>
                    </ol>
                </nav>

                <form onSubmit={handleUpdate} className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border mb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-light text-foreground">{name}</h1>
                            <p className="text-sm text-muted-foreground mt-1 font-light">
                            Account:{" "}
                            {accountId ? (
                                <Link to={`/accounts/${accountId}`} className="font-medium text-accent hover:underline">
                                {accountName}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">{accountName}</span>
                            )}
                            </p>
                        </div>
                        {isSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg px-4 py-2 text-sm font-medium animate-pulse">
                            ✓ Project saved successfully!
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="text-sm text-muted-foreground font-light mb-1 block">Project Status</label>
                            <Listbox value={fields["Project Status"]} onChange={value => setFields(f => ({ ...f, "Project Status": value }))}>
                                <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-secondary py-2 pl-3 pr-10 text-left border border-border shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/50 sm:text-sm">
                                    <span className="block truncate text-foreground">{fields["Project Status"] || "Select status"}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {PROJECT_STATUS_OPTIONS.map((status) => (
                                        <Listbox.Option key={status} className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4', active ? 'bg-primary/20 text-white' : 'text-foreground')} value={status}>
                                        {({ selected }) => (
                                            <>
                                            <span className={classNames('block truncate', selected ? 'font-semibold' : 'font-normal')}>{status}</span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                            </>
                                        )}
                                        </Listbox.Option>
                                    ))}
                                    </Listbox.Options>
                                </Transition>
                                </div>
                            </Listbox>
                        </div>

                        <div>
                            <label className="text-sm text-muted-foreground font-light mb-1 block">Project Value ($)</label>
                            <input
                                type="number"
                                min="0"
                                className="border border-border bg-secondary rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                                value={fields["Project Value"]}
                                onChange={e => setFields(f => ({...f, "Project Value": e.target.value}))}
                                placeholder="e.g., 5000"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-muted-foreground font-light mb-1 block">Start Date</label>
                            <input
                                type="date"
                                className="border border-border bg-secondary rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                value={fields["Start Date"]}
                                onChange={e => setFields(f => ({...f, "Start Date": e.target.value}))}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-muted-foreground font-light mb-1 block">End Date</label>
                            <input
                                type="date"
                                className="border border-border bg-secondary rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                value={fields["End Date"]}
                                onChange={e => setFields(f => ({...f, "End Date": e.target.value}))}
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="text-sm text-muted-foreground font-light mb-1 block">Project Description</label>
                            <textarea
                                rows={4}
                                className="border border-border bg-secondary rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                                value={fields["Project Description"]}
                                onChange={e => setFields(f => ({...f, "Project Description": e.target.value}))}
                                placeholder="Add a detailed description for the project..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center mt-8">
                        {updateError && (
                            <p className="text-sm text-red-500 mr-4">{updateError.message || "Failed to save project."}</p>
                        )}
                        <button
                        type="submit"
                        disabled={isUpdating}
                        className={`rounded-lg px-6 py-2 text-sm font-semibold shadow-sm transition ${
                            isUpdating
                            ? "bg-primary/50 cursor-not-allowed text-background/50"
                            : "bg-primary hover:bg-primary/90 text-background"
                        }`}
                        >
                        {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

                <div>
                    <h2 className="text-2xl font-light text-foreground mb-4 mt-10">Project Updates</h2>
                    <div className="space-y-4">
                    {updatesLoading ? (
                        <p className="text-muted-foreground font-light">Loading updates...</p>
                    ) : updates && updates.length > 0 ? (
                        updates.map((update) => {
                        const taskId = update.fields.Task?.[0];
                        const taskName = taskIdToName[taskId];
                        return (
                            <Link
                                to={`/updates/${update.id}`}
                                key={update.id}
                                className="block bg-secondary p-4 rounded-lg border border-border hover:bg-[#2E2E2E] transition-colors duration-200 group"
                            >
                                <p className="text-foreground whitespace-pre-wrap mb-3 font-light">
                                {update.fields.Notes || <span className="italic">No notes provided.</span>}
                                </p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border">
                                <span>
                                    <strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}
                                </span>
                                {taskId && taskName && (
                                    <span>
                                    <strong>Task: </strong>
                                    <Link to={`/tasks/${taskId}`} className="text-accent hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                                        {taskName}
                                    </Link>
                                    </span>
                                )}
                                </div>
                            </Link>
                        );
                        })
                    ) : (
                        <div className="text-center text-muted-foreground bg-secondary p-6 rounded-lg border border-border italic font-light">No updates have been recorded for this project.</div>
                    )}
                    </div>
                </div>
            </motion.div>
        </div>
=======
  if (isLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading project details...</div>;
  if (fetchError) return <div className="text-red-500 text-center py-10">Error loading project: {fetchError.message}</div>;
  if (!project) return <div className="text-center py-10 text-gray-500">No project data found.</div>;

  const name = project.fields["Project Name"] || "Unnamed Project";
  const accountName = project.fields["Account Name (from Account)"]?.[0] || "N/A";
  const accountId = project.fields.Account?.[0]; // This is the numerical account ID

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/projects" className="hover:text-blue-600 hover:underline">Projects</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="font-semibold text-gray-700">{name}</span>
          </li>
        </ol>
      </nav>

      <form onSubmit={handleUpdate} className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 mb-10">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Account:{" "}
                  {accountId ? (
                    <Link to={`/accounts/${accountId}`} className="font-medium text-blue-600 hover:underline">
                      {accountName}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-800">{accountName}</span>
                  )}
                </p>
            </div>
             {isSuccess && (
                <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-2 text-sm font-medium animate-fadeIn">
                ✓ Project saved successfully!
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Project Status</label>
                 <Listbox value={fields["Project Status"]} onChange={value => setFields(f => ({ ...f, "Project Status": value }))}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                        <span className="block truncate">{fields["Project Status"] || "Select status"}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {PROJECT_STATUS_OPTIONS.map((status) => (
                            <Listbox.Option key={status} className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4', active ? 'bg-blue-100 text-blue-900' : 'text-gray-900')} value={status}>
                              {({ selected }) => (
                                <>
                                  <span className={classNames('block truncate', selected ? 'font-medium' : 'font-normal')}>{status}</span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                </Listbox>
            </div>

            <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Project Value ($)</label>
                <input
                    type="number"
                    min="0"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={fields["Project Value"]}
                    onChange={e => setFields(f => ({...f, "Project Value": e.target.value}))}
                    placeholder="e.g., 5000"
                />
            </div>

            <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Start Date</label>
                <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={fields["Start Date"]}
                    onChange={e => setFields(f => ({...f, "Start Date": e.target.value}))}
                />
            </div>

            <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">End Date</label>
                <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={fields["End Date"]}
                    onChange={e => setFields(f => ({...f, "End Date": e.target.value}))}
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-medium mb-1 block">Project Description</label>
                <textarea
                    rows={4}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={fields["Project Description"]}
                    onChange={e => setFields(f => ({...f, "Project Description": e.target.value}))}
                    placeholder="Add a detailed description for the project..."
                />
            </div>
        </div>

        <div className="flex justify-end items-center mt-8">
             {updateError && (
                <p className="text-sm text-red-600 mr-4">{updateError.message || "Failed to save project."}</p>
            )}
            <button
              type="submit"
              disabled={isUpdating}
              className={`rounded-lg px-6 py-2 text-white text-sm font-semibold shadow-sm transition ${
                isUpdating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-700"
              }`}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Project Updates</h2>
        <div className="space-y-4">
          {updatesLoading ? (
            <p className="text-gray-500">Loading updates...</p>
          ) : updates && updates.length > 0 ? (
            updates.map((update) => {
              const taskId = update.fields.Task?.[0];
              const taskName = taskIdToName[taskId];
              return (
                 <Link
                    to={`/updates/${update.id}`}
                    key={update.id}
                    className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150 group"
                  >
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">
                      {update.fields.Notes || <span className="italic">No notes provided.</span>}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>
                        <strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}
                      </span>
                      {taskId && taskName && (
                        <span>
                          <strong>Task: </strong>
                          <Link to={`/tasks/${taskId}`} className="text-blue-600 hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                            {taskName}
                          </Link>
                        </span>
                      )}
                    </div>
                 </Link>
              );
            })
          ) : (
            <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-md italic">No updates have been recorded for this project.</div>
          )}
        </div>
      </div>
>>>>>>> origin
    </div>
  );
}
