import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllAccountsForAdmin, fetchAllUsersForAdmin } from '../api';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminAccountList() {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ownerId: '' });
  const navigate = useNavigate();

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await fetchAllAccountsForAdmin(filters);
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Could not load account data.");
    } finally {
      setLoading(false);
    }
  }, [filters.ownerId]);
  
  useEffect(() => {
    const loadFilterData = async () => {
        try {
            const fetchedUsers = await fetchAllUsersForAdmin();
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Failed to load user data for filters", err);
        }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ ownerId: '' });
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-light text-foreground">Manage Accounts</h1>
                <p className="text-muted-foreground mt-1">A list of all accounts in the system.</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-full sm:w-1/3">
                <select 
                    name="ownerId" 
                    id="ownerId" 
                    onChange={handleFilterChange} 
                    value={filters.ownerId} 
                    className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                >
                    <option value="">Filter by All Owners</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.fields['User Name']}</option>)}
                </select>
            </div>
             {filters.ownerId && (
                <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                    <XMarkIcon className="h-4 w-4" />
                    Clear Filter
                </button>
            )}
        </div>

        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Account Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Owner</th>
                    </tr>
                    </thead>
                    <tbody className="bg-[#333333] divide-y divide-border">
                    {loading ? (
                        <tr><td colSpan="3" className="py-8 text-center text-muted-foreground">Loading accounts...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="3" className="py-8 text-center text-red-500">{error}</td></tr>
                    ) : accounts.length > 0 ? (
                        accounts.map((account) => (
                            <tr key={account.id} className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/accounts/${account.id}`)}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{account.fields['Account Name']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{account.fields['Account Type']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{account.fields['Account Owner Name']}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" className="py-8 text-center text-muted-foreground">No accounts found for the selected filter.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}