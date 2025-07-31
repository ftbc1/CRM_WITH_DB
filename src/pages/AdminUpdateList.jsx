import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllUpdatesForAdmin, fetchAllUsersForAdmin, fetchAllProjectsForAdmin } from '../api';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminUpdateList() {
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ownerId: '', projectId: '', startDate: '', endDate: '' });

  const loadUpdates = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedUpdates = await fetchAllUpdatesForAdmin(filters);
      setUpdates(fetchedUpdates);
      setError(null);
    } catch (err) {
      console.error("Error fetching updates:", err);
      setError("Could not load update data.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadFilterData = async () => {
        try {
            const [fetchedUsers, fetchedProjects] = await Promise.all([
                fetchAllUsersForAdmin(),
                fetchAllProjectsForAdmin()
            ]);
            setUsers(fetchedUsers);
            setProjects(fetchedProjects);
        } catch (err) {
            console.error("Failed to load filter data", err);
        }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ ownerId: '', projectId: '', startDate: '', endDate: '' });
  };
  
  const hasActiveFilters = filters.ownerId || filters.projectId || filters.startDate || filters.endDate;

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-light text-foreground">Manage Updates</h1>
                <p className="text-muted-foreground mt-1">A chronological list of all updates posted in the system.</p>
            </div>
        </div>
        
        <div className="flex flex-wrap items-end gap-4 mb-8">
            <div className="flex-grow sm:flex-grow-0">
                <label htmlFor="startDate" className="block text-sm font-light text-muted-foreground mb-1">Start Date</label>
                <input type="date" name="startDate" id="startDate" onChange={handleFilterChange} value={filters.startDate} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
            </div>
            <div className="flex-grow sm:flex-grow-0">
                <label htmlFor="endDate" className="block text-sm font-light text-muted-foreground mb-1">End Date</label>
                <input type="date" name="endDate" id="endDate" onChange={handleFilterChange} value={filters.endDate} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
            </div>
            <div className="flex-grow sm:flex-grow-0">
                <label htmlFor="ownerId" className="block text-sm font-light text-muted-foreground mb-1">Owner</label>
                <select name="ownerId" id="ownerId" onChange={handleFilterChange} value={filters.ownerId} className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                    <option value="">All Owners</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.fields['User Name']}</option>)}
                </select>
            </div>
            <div className="flex-grow sm:flex-grow-0">
                <label htmlFor="projectId" className="block text-sm font-light text-muted-foreground mb-1">Project</label>
                <select name="projectId" id="projectId" onChange={handleFilterChange} value={filters.projectId} className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                    <option value="">All Projects</option>
                    {projects.map(project => <option key={project.id} value={project.id}>{project.fields['Project Name']}</option>)}
                </select>
            </div>
             {hasActiveFilters && (
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
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Notes</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Project</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                        {loading ? (
                            <tr><td colSpan="4" className="py-8 text-center text-muted-foreground">Loading updates...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="4" className="py-8 text-center text-red-500">{error}</td></tr>
                        ) : updates.length > 0 ? (
                            updates.map((update) => (
                                <tr key={update.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-muted-foreground sm:pl-6">{new Date(update.fields['Date']).toLocaleDateString()}</td>
                                    <td className="py-4 px-3 text-sm text-foreground whitespace-pre-wrap">{update.fields['Notes']}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Project Name']}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Update Owner Name']}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="py-8 text-center text-muted-foreground">No updates found for the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}