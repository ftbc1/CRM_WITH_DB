import React from "react";
import { Link } from "react-router-dom";
import UpdateForm from "./UpdateForm";
import UpdateDisplay from "./UpdateDisplay";
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
>>>>>>> origin

export default function ProjectCard({
  record,
  update,
  notes,
  updateType,
  updateTypeOptions,
  error,
  onNotesChange,
  onTypeChange,
  onCreateUpdate,
  onExpandNote,
  userName,
  isSuccess,
}) {
<<<<<<< HEAD
  const projectId = record.id;
  const account = record.fields.Account?.[0];
  const accountName = record.fields["Account Name (from Account)"]?.[0] || "N/A";

  // Define status colors based on the project status
  const statusColors = {
    "Need Analysis": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Negotiation": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Closed Won": "bg-green-500/10 text-green-400 border-green-500/20",
    "Closed Lost": "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const statusColor = statusColors[record.fields["Project Status"]] || "bg-secondary text-muted-foreground border-border";

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#333333] rounded-2xl border border-border p-6"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Project Details Section */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Link
            to={`/projects/${projectId}`}
            className="font-light text-xl text-foreground hover:text-accent transition-colors"
          >
            {record.fields["Project Name"] || "Unnamed Project"}
          </Link>
          <div className="mt-3 text-sm space-y-2">
            <p className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
                {record.fields["Project Status"] || "N/A"}
            </p>
            <p className="text-muted-foreground">
              Account:{" "}
              {account ? (
                <Link
                  to={`/accounts/${account}`}
                  className="text-accent hover:underline"
=======
  const projectId = record.id; // This is now the numerical ID
  const account = record.fields.Account?.[0]; // This is now the numerical ID
  const accountName = record.fields["Account Name (from Account)"]?.[0] || "N/A";

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-1/4 min-w-[180px] max-w-[240px]">
          <Link
            to={`/projects/${projectId}`} // Links to /projects/123
            className="font-semibold hover:text-blue-600"
          >
            {record.fields["Project Name"] || "Unnamed Project"}
          </Link>
          <div className="mt-2 text-sm space-y-1">
            <p>
              Status:{" "}
              <span className="text-gray-700">
                {record.fields["Project Status"] || "N/A"}
              </span>
            </p>
            <p>
              Account:{" "}
              {account ? (
                <Link
                  to={`/accounts/${account}`} // Links to /accounts/456
                  className="text-blue-600 hover:underline"
>>>>>>> origin
                >
                  {accountName}
                </Link>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Update Section */}
        <div className="flex-1 w-full">
            {isSuccess ? (
              <div className="flex items-center justify-center h-full bg-green-500/10 text-green-400 rounded-lg p-4 border border-green-500/20">
                <p className="font-light">✓ Update saved successfully!</p>
=======
        <div className="flex-1 flex flex-row items-start gap-3 w-full">
          <div className="flex-1 min-w-[200px] max-w-full">
            {isSuccess ? (
              <div className="flex items-center justify-center h-full bg-green-50 text-green-800 rounded-md p-4 border border-green-200">
                <p className="font-semibold">✓ Update saved successfully!</p>
>>>>>>> origin
              </div>
            ) : update ? (
              <UpdateDisplay
                update={update}
                userName={userName}
                onExpand={() => onExpandNote(update)}
              />
            ) : (
              <UpdateForm
                notes={notes}
                updateType={updateType}
                updateTypeOptions={updateTypeOptions}
                onNotesChange={onNotesChange}
                onTypeChange={onTypeChange}
                onSubmit={onCreateUpdate}
                error={error}
              />
            )}
<<<<<<< HEAD
        </div>
      </div>
    </motion.div>
  );
}
=======
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> origin
