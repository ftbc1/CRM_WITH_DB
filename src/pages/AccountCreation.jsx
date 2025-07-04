import React, { useState, Fragment, useEffect } from "react";
import { createAccount } from "../api";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Building2, AlertTriangle, CheckCircle } from "lucide-react";

const ACCOUNT_TYPE_OPTIONS = [
  "Channel Partner",
  "Client",
  "Vendor",
  "Technology Partner",
  "Internal Initiative", 
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// A reusable Toast Notification component
const Notification = ({ show, onHide, message, type }) => {
  if (!show) return null;

  // Added z-50 to ensure it appears above the navbar
  const baseClasses = "fixed top-5 right-5 w-full max-w-sm p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 ease-in-out z-50";
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

export default function AccountCreation() {
  const [fields, setFields] = useState({
    "Account Name": "",
    "Account Type": ACCOUNT_TYPE_OPTIONS[0],
    "Account Description": "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const accountOwnerId = localStorage.getItem("userRecordId") || "";
  const userName = localStorage.getItem("userName") || "Current User";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fields["Account Name"] || !fields["Account Type"]) {
        setNotification({ show: true, message: "Account Name and Type are required.", type: 'error' });
        return;
    }
    setLoading(true);

    try {
      const account = await createAccount({
        "Account Name": fields["Account Name"],
        "Account Type": fields["Account Type"],
        "Account Description": fields["Account Description"],
        "Account Owner": accountOwnerId ? [accountOwnerId] : [],
      });

      const prevAccountIds = JSON.parse(localStorage.getItem("accountIds") || "[]");
      const newAccountIds = [...new Set([...prevAccountIds, account.id])];
      localStorage.setItem("accountIds", JSON.stringify(newAccountIds));
      
      setNotification({ show: true, message: "Account created successfully!", type: 'success' });
      setFields({ "Account Name": "", "Account Type": ACCOUNT_TYPE_OPTIONS[0], "Account Description": "" });

    } catch (error) {
      setNotification({ show: true, message: error.message || "Failed to create account.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Notification 
        show={notification.show}
        onHide={() => setNotification(prev => ({...prev, show: false}))}
        message={notification.message}
        type={notification.type}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900">Create a New Account</h2>
                <p className="mt-2 text-lg text-gray-600">Add a new client, partner, or vendor to your CRM.</p>
            </div>
          
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                            id="account-name"
                            required
                            type="text"
                            placeholder="e.g., Global Tech Inc."
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={fields["Account Name"]}
                            onChange={e => setFields(f => ({ ...f, "Account Name": e.target.value }))}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Listbox value={fields["Account Type"]} onChange={value => setFields(f => ({ ...f, "Account Type": value }))}>
                            <div>
                                <Listbox.Label className="block text-sm font-medium text-gray-700">Account Type</Listbox.Label>
                                <div className="mt-1 relative">
                                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <span className="flex items-center">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                    <span className="ml-3 block truncate">{fields["Account Type"]}</span>
                                    </span>
                                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {ACCOUNT_TYPE_OPTIONS.map(type => (
                                        <Listbox.Option key={type} className={({ active }) => classNames(active ? 'text-white bg-gray-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={type}>
                                        {({ selected, active }) => (
                                            <>
                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>{type}</span>
                                            {selected ? (<span className={classNames(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
                                            </>
                                        )}
                                        </Listbox.Option>
                                    ))}
                                    </Listbox.Options>
                                </Transition>
                                </div>
                            </div>
                        </Listbox>

                         <div>
                            <label className="block text-sm font-medium text-gray-700">Account Owner</label>
                            <div className="mt-1">
                                <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-3 py-2.5 rounded-full">{userName}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Account Description</label>
                        <div className="mt-1">
                        <textarea
                            id="description"
                            rows="4"
                            placeholder="Add a detailed description for the account..."
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            value={fields["Account Description"]}
                            onChange={e => setFields(f => ({ ...f, "Account Description": e.target.value }))}
                        />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                        >
                        {loading ? (
                            <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                            </>
                        ) : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </>
  );
}