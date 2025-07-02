import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUpdateById, fetchProjectById, fetchTaskById } from "../api/index.js";
import React from "react";

export default function UpdateDetail() {
  const { id } = useParams(); // This is the numerical update ID

  // Fetch the specific update
  const { data: update, isLoading: updateLoading, error: updateError } = useQuery({
    queryKey: ["update", id],
    queryFn: () => fetchUpdateById(id),
    enabled: !!id,
  });

  // Get the numerical IDs for the related project and task
  const projectId = update?.fields.Project?.[0];
  const taskId = update?.fields.Task?.[0];

  // Fetch the related project's details
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId,
  });

  // Fetch the related task's details
  const { data: task } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
  });

  if (updateLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading update details...</div>;
  if (updateError) return <div className="text-red-500 text-center py-10">Error loading update: {updateError.message}</div>;
  if (!update) return <div className="text-center py-10 text-gray-500">No update data found.</div>;

  const notes = update.fields.Notes || <span className="italic">No notes provided.</span>;
  const date = update.fields.Date ? new Date(update.fields.Date).toLocaleDateString() : "N/A";
  const type = update.fields["Update Type"] || "N/A";
  const ownerName = update.fields["Update Owner Name"] || "N/A";
  const projectName = project?.fields["Project Name"] || "N/A";
  const taskName = task?.fields["Task Name"] || "N/A";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/projects" className="hover:text-blue-600 hover:underline">Projects</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li className="flex items-center text-gray-400">
            <span className="truncate max-w-[200px]">{projectName}</span>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="font-semibold text-gray-700">Update</span>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Update Details</h1>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-800">{type}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600">
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Owner:</strong> {ownerName}</p>
            <p>
                <strong>Project:</strong>{" "}
                {projectId ? (
                    <Link to={`/projects/${projectId}`} className="font-medium text-blue-600 hover:underline">
                        {projectName}
                    </Link>
                ) : ( "N/A" )}
            </p>
            <p>
                <strong>Task:</strong>{" "}
                {taskId ? (
                    <Link to={`/tasks/${taskId}`} className="font-medium text-blue-600 hover:underline">
                        {taskName}
                    </Link>
                ) : ( "N/A" )}
            </p>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
        </div>
      </div>
    </div>
  );
}