import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProjectsForAdmin, fetchAllUsersForAdmin, fetchAllAccountsForAdmin } from '../api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';

export default function AdminProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', ownerId: '', accountId: '' });
  const debouncedSearch = useDebounce(filters.search, 300);
  
  const navigate = useNavigate();

  const loadProjects = useCallback(async () => {
      try {
        setLoading(true);
        const fetchedProjects = await fetchAllProjectsForAdmin({
            search: debouncedSearch,
            status: filters.status,
            ownerId: filters.ownerId,
            accountId: filters.accountId,
        });
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Could not load project data.");
      } finally {
        setLoading(false);
      }
  }, [debouncedSearch, filters.status, filters.ownerId, filters.accountId]);

  useEffect(() => {
    const loadFilterData = async () => {
        try {
            const [fetchedUsers, fetchedAccounts] = await Promise.all([
                fetchAllUsersForAdmin(),
                fetchAllAccountsForAdmin()
            ]);
            setUsers(fetchedUsers);
            setAccounts(fetchedAccounts);
        } catch (err) {
            console.error("Failed to load filter data", err);
        }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', ownerId: '', accountId: '' });
  };
  
  const hasActiveFilters = filters.status || filters.ownerId || filters.accountId;

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-light text-foreground">Manage Projects</h1>
                <p className="text-muted-foreground mt-1">A list of all projects across all accounts.</p>
            </div>
        </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by project name..."
            className="border border-border bg-secondary rounded-md px-4 py-2 text-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
        />
        <select name="status" onChange={handleFilterChange} value={filters.status} className="block w-full sm:w-auto rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
            <option value="">All Statuses</option>
            <option value="Need Analysis">Need Analysis</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
        </select>
        <select name="ownerId" onChange={handleFilterChange} value={filters.ownerId} className="block w-full sm:w-auto rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
            <option value="">All Owners</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.fields['User Name']}</option>)}
        </select>
        <select name="accountId" onChange={handleFilterChange} value={filters.accountId} className="block w-full sm:w-auto rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
            <option value="">All Accounts</option>
            {accounts.map(account => <option key={account.id} value={account.id}>{account.fields['Account Name']}</option>)}
        </select>
        {(hasActiveFilters || filters.search) && (
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                <XMarkIcon className="h-4 w-4" />
                Clear Filters
            </button>
        )}
      </div>

      <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Project Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Account</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Owner</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-[#333333]">
                  {loading ? (
                    <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">Loading projects...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="5" className="py-8 text-center text-red-500">{error}</td></tr>
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <tr key={project.id} className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/projects/${project.id}`)}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{project.fields['Project Name']}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Account Name (from Account)'] || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Owner Name'] || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Status']}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">₹{(project.fields['Project Value'] || 0).toLocaleString()}</td>
                        </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">No projects found for the selected filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
    </div>
  );
}