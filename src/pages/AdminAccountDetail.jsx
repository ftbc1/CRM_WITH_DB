import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAdminAccountDetail } from '../api';
import { ArrowLeftIcon, BriefcaseIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminAccountDetail() {
  const { id } = useParams();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccountDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminAccountDetail(id);
        setAccountData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Could not load account details.");
      } finally {
        setLoading(false);
      }
    };
    loadAccountDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg text-muted-foreground">Loading account details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }

  if (!accountData) {
    return <div className="text-center py-10 text-muted-foreground">Account not found.</div>
  }

  const { account, projects } = accountData;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center">
            <li className="flex items-center">
                <Link to="/admin/accounts" className="hover:text-accent transition-colors">Accounts</Link>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
            </li>
            <li>
                <span className="font-semibold text-foreground">{account.fields['Account Name']}</span>
            </li>
            </ol>
        </nav>
        <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border">
            <h1 className="text-3xl font-light text-foreground">{account.fields['Account Name']}</h1>
            <p className="mt-1 text-muted-foreground">
              Type: <span className="font-medium text-foreground">{account.fields['Account Type']}</span> | Owner: <span className="font-medium text-foreground">{account.fields['Account Owner Name']}</span>
            </p>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
                {account.fields['Account Description']}
            </p>
        </div>
      </div>

      {/* Projects Table */}
      <div>
        <h2 className="text-2xl font-light text-foreground flex items-center gap-2 mb-4">
            <BriefcaseIcon className="h-6 w-6 text-accent" />
            Associated Projects ({projects.length})
        </h2>
        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Project Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Owner</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                        {projects.length > 0 ? projects.map((project) => (
                            <tr 
                                key={project.id}
                                className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/admin/projects/${project.id}`)}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{project.fields['Project Name']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Status']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Owner Name']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">₹{(project.fields['Project Value'] || 0).toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-muted-foreground">This account has no projects.</td>
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