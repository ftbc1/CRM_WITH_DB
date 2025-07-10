<<<<<<< HEAD
import React, { Fragment } from "react";
=======
import React from "react";
>>>>>>> origin
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const UPDATE_TYPE_OPTIONS = [
  "Call",
  "Email",
  "Online Meeting",
  "Physical Meeting",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpdateForm({
  notes,
  updateType,
  onNotesChange,
  onTypeChange,
  onSubmit,
  error,
}) {
  return (
    <form
      className="flex flex-col sm:flex-row gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
<<<<<<< HEAD
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="resize-none p-3 border border-border bg-secondary rounded-lg text-sm w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-foreground placeholder-muted-foreground"
=======
      {/* Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="resize-none p-3 border border-gray-300 rounded-lg text-sm w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
>>>>>>> origin
        placeholder="Enter your update here..."
        required
      ></textarea>

<<<<<<< HEAD
      <div className="flex flex-col justify-between items-stretch gap-2 sm:w-[160px]">
        <Listbox value={updateType} onChange={onTypeChange}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-secondary py-2 pl-3 pr-10 text-left border border-border shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <span className="block truncate text-foreground">{updateType}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-muted-foreground"
=======
      {/* Right column with dropdown and button */}
      <div className="flex flex-col justify-between items-stretch gap-2 sm:w-[160px]">
        {/* Stylish Dropdown */}
        <Listbox value={updateType} onChange={onTypeChange}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">{updateType}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
>>>>>>> origin
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
<<<<<<< HEAD
                as={Fragment}
=======
                as="div"
>>>>>>> origin
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
<<<<<<< HEAD
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-secondary py-1 text-sm shadow-lg ring-1 ring-border focus:outline-none max-h-60">
=======
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60">
>>>>>>> origin
                  {UPDATE_TYPE_OPTIONS.map((type) => (
                    <Listbox.Option
                      key={type}
                      value={type}
                      className={({ active }) =>
                        classNames(
<<<<<<< HEAD
                          active ? "bg-primary/20 text-white" : "text-foreground",
=======
                          active ? "bg-blue-600 text-white" : "text-gray-900",
>>>>>>> origin
                          "cursor-default select-none relative py-2 pl-10 pr-4"
                        )
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
<<<<<<< HEAD
                              selected ? "font-semibold" : "font-normal",
=======
                              selected ? "font-medium" : "font-normal",
>>>>>>> origin
                              "block truncate"
                            )}
                          >
                            {type}
                          </span>
                          {selected && (
                            <span
                              className={classNames(
<<<<<<< HEAD
                                active ? "text-white" : "text-accent",
=======
                                active ? "text-white" : "text-blue-600",
>>>>>>> origin
                                "absolute inset-y-0 left-0 flex items-center pl-3"
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>

<<<<<<< HEAD
        <button
          type="submit"
          className="bg-primary text-sm font-medium px-4 py-2 rounded-lg text-background hover:bg-primary/90 transition-all shadow-sm"
=======
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gray-400 text-sm font-medium px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-all shadow-sm"
>>>>>>> origin
        >
          Save Update
        </button>

<<<<<<< HEAD
        {error && (
          <div className="text-red-500 text-xs mt-1 text-center">
=======
        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-xs mt-1 text-center">
>>>>>>> origin
            {error}
          </div>
        )}
      </div>
    </form>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin
