import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsersForAdmin } from '../api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  const filteredUsers = users.filter(user => 
    user.fields['User Name'].toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsersForAdmin();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Could not load user data.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-light text-foreground">Manage Users</h1>
          <p className="text-muted-foreground mt-1">A list of all users in the system.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name..."
            className="border border-border bg-secondary rounded-md px-4 py-2 text-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
        />
      </div>

      <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">User Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Role</th>
                </tr>
              </thead>
              <tbody className="bg-[#333333] divide-y divide-border">
                {loading ? (
                  <tr><td colSpan="2" className="py-8 text-center text-muted-foreground">Loading users...</td></tr>
                ) : error ? (
                  <tr><td colSpan="2" className="py-8 text-center text-red-500">{error}</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{user.fields['User Name']}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.fields['User Type'] === 'admin' ? 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/20' : 'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/30'}`}>
                                  {user.fields['User Type']}
                              </span>
                          </td>
                      </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" className="py-8 text-center text-muted-foreground">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}