import React, { useState, useEffect, Fragment } from "react";
import { createProject, fetchAccountsByIds, updateUser } from "../api/index.js";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Briefcase, Building2, Calendar, Workflow, AlertTriangle, CheckCircle } from "lucide-react";

const PROJECT_STATUS_OPTIONS = [
  "Negotiation",
  "Need Analysis",
  "Closed Won",
  "Closed Lost",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// A reusable Toast Notification component
const Notification = ({ show, onHide, message, type }) => {
  if (!show) return null;
    
  // Added z-50 to ensure it appears above the navbar
  const baseClasses = "fixed top-5 right-5 w-full max-w-sm p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 ease-in-out z-50";
  const typeClasses = { success: "bg-green-500", error: "bg-red-500" };
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;
  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0"><Icon className="h-6 w-6 text-white" aria-hidden="true" /></div>
        <div className="ml-3 w-0 flex-1 pt-0.5"><p className="text-sm font-medium">{message}</p></div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={onHide} className="inline-flex rounded-md text-white hover:text-gray-200 focus:outline-none"><span className="sr-only">Close</span><XMarkIcon className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
};

// A reusable Skeleton Loader component
const SkeletonLoader = () => (
    <div className="w-full p-4 border border-gray-200 rounded-md shadow"><div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-3 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-200 rounded col-span-2"></div><div className="h-2 bg-slate-200 rounded col-span-1"></div></div></div></div></div>
);

export default function ProjectCreation() {
  const [fields, setFields] = useState({
    "Project Name": "",
    "Project Status": PROJECT_STATUS_OPTIONS[0],
    "Start Date": "",
    "End Date": "",
    "Account": null,
    "Project Value": "",
    "Project Description": "",
  });
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const projectOwnerId = localStorage.getItem("userRecordId") || "";

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("accountIds") || "[]");
    if (ids.length) {
      fetchAccountsByIds(ids).then(data => {
        setAccounts(data);
        setAccountsLoading(false);
      });
    } else {
        setAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification(p => ({ ...p, show: false })), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fields["Project Name"] || !fields["Account"]) {
        setNotification({ show: true, message: "Project Name and Account are required.", type: 'error' });
        return;
    }
    setLoading(true);
    try {
      const projectData = {
          ...fields,
          "Account": fields.Account?.id ? [fields.Account.id] : [],
          "Project Owner": projectOwnerId ? [projectOwnerId] : []
      };
      const project = await createProject(projectData);

      const prevProjectIds = JSON.parse(localStorage.getItem("projectIds") || "[]");
      const newProjectIds = [...new Set([...prevProjectIds, project.id])];
      localStorage.setItem("projectIds", JSON.stringify(newProjectIds));

      setNotification({ show: true, message: "Project created successfully!", type: 'success' });
      // Reset form or navigate away
      setFields({ "Project Name": "", "Project Status": PROJECT_STATUS_OPTIONS[0], "Start Date": "", "End Date": "", "Account": null, "Project Value": "", "Project Description": ""});

    } catch (error) {
      setNotification({ show: true, message: error.message || "Failed to create project.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Notification show={notification.show} onHide={() => setNotification(p => ({...p, show: false}))} message={notification.message} type={notification.type} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900">Create a New Project</h2>
                <p className="mt-2 text-lg text-gray-600">Organize your work into projects and assign them to accounts.</p>
            </div>
          
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input id="project-name" required type="text" placeholder="e.g., Q4 Enterprise Solutions" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={fields["Project Name"]} onChange={e => setFields(f => ({ ...f, "Project Name": e.target.value }))} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {accountsLoading ? <SkeletonLoader /> : (
                            <Listbox value={fields["Account"]} onChange={value => setFields(f => ({ ...f, "Account": value }))}>
                                <div>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Account</Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <span className="flex items-center"><Building2 className="h-5 w-5 text-gray-400" /><span className="ml-3 block truncate">{fields.Account ? fields.Account.fields["Account Name"] : "Select an account"}</span></span>
                                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                {accounts.map(acc => (<Listbox.Option key={acc.id} className={({ active }) => classNames(active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={acc}>{({ selected, active }) => (<><span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{acc.fields["Account Name"]}</span>{selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}</Listbox.Option>))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </div>
                            </Listbox>
                        )}
                        <Listbox value={fields["Project Status"]} onChange={value => setFields(f => ({ ...f, "Project Status": value }))}>
                            <div>
                                <Listbox.Label className="block text-sm font-medium text-gray-700">Project Status</Listbox.Label>
                                <div className="mt-1 relative">
                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="flex items-center"><Workflow className="h-5 w-5 text-gray-400" /><span className="ml-3 block truncate">{fields["Project Status"]}</span></span>
                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {PROJECT_STATUS_OPTIONS.map(status => (<Listbox.Option key={status} className={({ active }) => classNames(active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={status}>{({ selected, active }) => (<><span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{status}</span>{selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}</Listbox.Option>))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </div>
                        </Listbox>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                <input id="start-date" type="date" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" value={fields["Start Date"]} onChange={e => setFields(f => ({ ...f, "Start Date": e.target.value }))}/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                <input id="end-date" type="date" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" value={fields["End Date"]} onChange={e => setFields(f => ({ ...f, "End Date": e.target.value }))}/>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="project-value" className="block text-sm font-medium text-gray-700 mb-1">Project Value ($)</label>
                        <input id="project-value" type="number" placeholder="e.g., 50000" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={fields["Project Value"]} onChange={e => setFields(f => ({ ...f, "Project Value": e.target.value }))} />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
                        <div className="mt-1"><textarea id="description" rows="4" placeholder="Add a detailed description for the project..." className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" value={fields["Project Description"]} onChange={e => setFields(f => ({ ...f, "Project Description": e.target.value }))}></textarea></div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading || accountsLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out">
                            {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating Project...</>) : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </>
  );
}