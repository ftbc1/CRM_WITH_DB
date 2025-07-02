import React from "react";
import { Routes, Route } from "react-router-dom";

// Import all the components that will be part of the tasks section
import Tasks from "./Tasks";
import TaskDetail from "./TaskDetail";
import AdminTasks from "./AdminTasks";
import CreateTask from "./CreateTask";

/**
 * This component now correctly routes all traffic under the /tasks/ URL path.
 */
export default function TasksRouter() {
  return (
    <Routes>
      {/* The "index" route defaults to the user's task list */}
      <Route index element={<Tasks />} />
      
      {/* Route for the admin's task overview page */}
      <Route path="admin" element={<AdminTasks />} />

      {/* Route for the task creation page */}
      <Route path="create" element={<CreateTask />} />
      
      {/* Route for viewing a single task's details */}
      <Route path=":id" element={<TaskDetail />} />
    </Routes>
  );
}
