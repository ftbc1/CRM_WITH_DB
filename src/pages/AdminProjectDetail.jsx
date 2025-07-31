import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAdminProjectDetail } from '../api';
import { BriefcaseIcon, ChatBubbleBottomCenterTextIcon, ClipboardDocumentListIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminProjectDetail(id);
        setProjectData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Could not load project details.");
      } finally {
        setLoading(false);
      }
    };
    loadProjectDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg text-muted-foreground">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }

  if (!projectData) {
    return <div className="text-center text-muted-foreground">Project not found.</div>
  }

  const { project, tasks, updates } = projectData;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center">
            <li className="flex items-center">
                <Link to="/admin/projects" className="hover:text-accent transition-colors">Projects</Link>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
            </li>
            <li>
                <span className="font-semibold text-foreground">{project.fields['Project Name']}</span>
            </li>
            </ol>
        </nav>
        <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border">
            <h1 className="text-3xl font-light text-foreground">{project.fields['Project Name']}</h1>
            <p className="mt-1 text-muted-foreground">
              Account: <span className="font-medium text-foreground">{project.fields['Account Name (from Account)']}</span> | Owner: <span className="font-medium text-foreground">{project.fields['Project Owner Name']}</span>
            </p>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
                {project.fields['Project Description']}
            </p>
        </div>
      </div>

      {/* Tasks Table */}
      <div>
        <h2 className="text-2xl font-light text-foreground flex items-center gap-2 mb-4">
            <ClipboardDocumentListIcon className="h-6 w-6 text-accent" />
            Tasks ({tasks.length})
        </h2>
        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Task Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Assigned To</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                        {tasks.length > 0 ? tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/tasks/${task.id}`)}>
                                <td className="py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{task.fields['Task Name']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Assigned To (Name)']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Status']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Due Date']}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-muted-foreground">This project has no tasks.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Updates Table */}
      <div>
        <h2 className="text-2xl font-light text-foreground flex items-center gap-2 mb-4">
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-accent" />
            Updates ({updates.length})
        </h2>
        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Notes</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                        {updates.length > 0 ? updates.map((update) => (
                            <tr key={update.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-muted-foreground sm:pl-6">{new Date(update.fields['Date']).toLocaleDateString()}</td>
                                <td className="py-4 px-3 text-sm text-foreground whitespace-pre-wrap">{update.fields['Notes']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Update Owner Name']}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-muted-foreground">This project has no updates.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}