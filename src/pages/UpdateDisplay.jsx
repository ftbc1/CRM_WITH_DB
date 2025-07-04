import React from "react";
import { Link } from "react-router-dom";

export default function UpdateDisplay({ update, userName, expanded, onExpand }) {
  if (!update || !update.fields) {
    return null; 
  }

  const notes = update.fields.Notes || "";
  const displayNotes = expanded || notes.length < 150 ? notes : `${notes.substring(0, 150)}...`;

  return (
    <div className="relative bg-gray-50 rounded-lg p-4 text-sm border">
      {/* --- STYLE UPDATE ---
        * Repositioned the badge to the top-right corner.
        * Updated colors to a neutral gray for a cleaner look.
        * Adjusted font size and weight.
      */}
      <span className="absolute top-3 right-3 text-xs font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full">
        {update.fields["Update Type"]}
      </span>

      <div className="flex items-center text-xs text-gray-500 mb-2">
        <span>
          <strong>By:</strong> {update.fields["Update Owner Name"] || userName}
        </span>
        <span className="mx-2">|</span>
        <span>
          <strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-800 whitespace-pre-wrap pt-2">{displayNotes}</p>
      
      <div className="flex justify-end gap-4 mt-2">
        {!expanded && notes.length > 150 && (
          <button onClick={onExpand} className="text-xs text-blue-600 hover:underline font-semibold">
            Show More
          </button>
        )}
        <Link to={`/updates/${update.id}`} className="text-xs text-blue-600 hover:underline font-semibold">
        </Link>
      </div>
    </div>
  );
}