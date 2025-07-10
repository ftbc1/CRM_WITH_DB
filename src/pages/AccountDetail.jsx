import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountById, fetchProjectsByIds } from "../api";
import React from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function AccountDetail() {
  const { id } = useParams();

  const { data: account, isLoading, error } = useQuery({
    queryKey: ["account", id],
    queryFn: () => fetchAccountById(id),
=======

export default function AccountDetail() {
  const { id } = useParams(); // This is now the numerical ID

  const { data: account, isLoading, error } = useQuery({
    queryKey: ["account", id],
    queryFn: () => fetchAccountById(id), // Fetch using the numerical ID
>>>>>>> origin
    enabled: !!id,
  });

  const projectIds = account?.fields?.Projects || [];
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["accountProjects", projectIds],
    queryFn: () => fetchProjectsByIds(projectIds),
    enabled: projectIds.length > 0,
  });

<<<<<<< HEAD
  if (isLoading) return <div className="text-center py-20 text-lg text-muted-foreground">Loading account details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading account: {error.message}</div>;
  if (!account) return <div className="text-center py-10 text-muted-foreground">No account data found.</div>;
=======
  if (isLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading account details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading account: {error.message}</div>;
  if (!account) return <div className="text-center py-10 text-gray-500">No account data found.</div>;
>>>>>>> origin

  const name = account.fields["Account Name"] || "Unnamed Account";
  const description = account.fields["Account Description"] || <span className="italic">No description provided.</span>;
  const type = account.fields["Account Type"] || "N/A";

<<<<<<< HEAD
  const statusColors = {
    "Need Analysis": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Negotiation": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Closed Won": "bg-green-500/10 text-green-400 border-green-500/20",
    "Closed Lost": "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-card w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center">
                    <li className="flex items-center">
                        <Link to="/accounts" className="hover:text-accent transition-colors">Accounts</Link>
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
                    </li>
                    <li>
                        <span className="font-semibold text-foreground">{name}</span>
                    </li>
                    </ol>
                </nav>

                <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border mb-10">
                    <h1 className="text-3xl font-light text-foreground">{name}</h1>
                    <p className="text-sm text-muted-foreground mt-1 font-light">
                    <strong>Type:</strong> {type}
                    </p>
                    <p className="mt-4 text-foreground font-light">{description}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-light text-foreground mb-4">Associated Projects</h2>
                    <div className="space-y-4">
                    {projectsLoading ? (
                        <p className="text-muted-foreground font-light">Loading projects...</p>
                    ) : projects && projects.length > 0 ? (
                        projects.map((project) => {
                            const statusColor = statusColors[project.fields["Project Status"]] || "bg-secondary text-muted-foreground border-border";
                            return (
                                <Link
                                    to={`/projects/${project.id}`}
                                    key={project.id}
                                    className="block bg-secondary p-4 rounded-lg border border-border hover:bg-[#2E2E2E] transition-colors duration-200"
                                >
                                    <div className="flex justify-between items-center">
                                    <span className="font-light text-accent">{project.fields["Project Name"]}</span>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColor}`}>{project.fields["Project Status"]}</span>
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="text-center text-muted-foreground bg-secondary p-6 rounded-lg border border-border italic font-light">No projects are associated with this account.</div>
                    )}
                    </div>
                </div>
            </motion.div>
        </div>
=======
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/accounts" className="hover:text-blue-600 hover:underline">Accounts</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="font-semibold text-gray-700">{name}</span>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 mb-10">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Type:</strong> {type}
        </p>
        <p className="mt-4 text-gray-700">{description}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Associated Projects</h2>
        <div className="space-y-4">
          {projectsLoading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <Link
                to={`/projects/${project.id}`} // Link using the numerical project ID
                key={project.id}
                className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-700">{project.fields["Project Name"]}</span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{project.fields["Project Status"]}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-md italic">No projects are associated with this account.</div>
          )}
        </div>
      </div>
>>>>>>> origin
    </div>
  );
}
