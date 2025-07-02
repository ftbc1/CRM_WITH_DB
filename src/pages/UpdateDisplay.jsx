import React from "react";
import { Link } from "react-router-dom";

export default function UpdateDisplay({ update, userName, expanded, onExpand }) {
  // FIX: Add a guard clause to prevent crash if update or update.fields is undefined
  if (!update || !update.fields) {
    return null; // or render a placeholder
  }

  const notes = update.fields.Notes || "";
  const displayNotes = expanded || notes.length < 150 ? notes : `${notes.substring(0, 150)}...`;

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm border">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>
          <strong>By:</strong> {update.fields["Update Owner Name"] || userName}
        </span>
        <span>
          <strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap">{displayNotes}</p>
      <div className="flex justify-end gap-4 mt-2">
        {!expanded && notes.length > 150 && (
          <button onClick={onExpand} className="text-xs text-blue-600 hover:underline font-semibold">
            Show More
          </button>
        )}
        <Link to={`/updates/${update.id}`} className="text-xs text-blue-600 hover:underline font-semibold">
          Details
        </Link>
      </div>
    </div>
  );
}
