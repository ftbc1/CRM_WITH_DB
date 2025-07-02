import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUpdatesByIds } from '../api';
import UpdateDisplay from './UpdateDisplay';
import { Link } from 'react-router-dom';

export default function Updates() {
  const updateIds = JSON.parse(localStorage.getItem("updateIds") || "[]");
  const userName = localStorage.getItem("userName") || "Current User";

  const { data: updates, isLoading, error } = useQuery({
    queryKey: ["userSpecificUpdates", updateIds],
    queryFn: () => fetchUpdatesByIds(updateIds),
    enabled: updateIds.length > 0,
    onError: (err) => {
      console.error("[UpdatesPage] Error fetching user-specific updates:", err);
    },
  });

  if (isLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading your updates...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading your updates: {error.message}</div>;

  if (!updates || updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-2">No Updates Found</h2>
        <p>You have not created or been assigned any updates yet.</p>
        <Link to="/update-creation" className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          Create Your First Update
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">My Updates</h1>
        <Link to="/create-update" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 font-semibold shadow-sm">
          + New Update
        </Link>
      </div>

      <div className="space-y-6">
        {/* FIX: Filter out any null or malformed records before mapping */}
        {updates.filter(Boolean).map((record) => {
          // Add a safety check for record.fields
          if (!record.fields) return null;

          const projectName = record.fields["Project Name"] || "N/A";
          const projectId = record.fields.Project?.[0];
          const taskName = record.fields["Task Name"] || "";
          const taskId = record.fields.Task?.[0];

          // The object passed to UpdateDisplay must be valid
          const updateForDisplay = {
            id: record.id,
            fields: record.fields,
          };

          return (
            <div key={record.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="pb-4 mb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500">
                  Associated with: 
                  {projectId ? (
                     <Link to={`/projects/${projectId}`} className="font-semibold text-blue-600 hover:underline ml-1">
                        {projectName}
                     </Link>
                  ) : <span className="font-semibold text-gray-700 ml-1">{projectName}</span>}
                 
                  {taskName && taskId && (
                    <>
                      <span className="mx-2">/</span>
                      <Link to={`/tasks/${taskId}`} className="font-semibold text-gray-700 hover:underline">
                        {taskName}
                      </Link>
                    </>
                  )}
                </p>
              </div>

              <UpdateDisplay
                update={updateForDisplay}
                userName={userName}
              />
               <div className="mt-4 text-right">
                 <Link
                   to={`/updates/${record.id}`}
                   className="inline-block px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                 >
                   View Details
                 </Link>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
