import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchAdminUserDetail } from '../api';
import { BuildingOffice2Icon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminUserDetail(id);
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Could not load user details.");
      } finally {
        setLoading(false);
      }
    };
    loadUserDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg text-muted-foreground">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }
  
  if (!userData) {
      return <div className="text-center text-muted-foreground">User not found.</div>
  }

  const { user, accounts } = userData;

  return (
    <div className="space-y-10">
      <div>
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center">
            <li className="flex items-center">
                <Link to="/admin/users" className="hover:text-accent transition-colors">Users</Link>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
            </li>
            <li>
                <span className="font-semibold text-foreground">{user.user_name}</span>
            </li>
            </ol>
        </nav>
        <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border">
            <h1 className="text-3xl font-light text-foreground">{user.user_name}</h1>
            <p className="mt-1 text-muted-foreground">
              Role: <span className="font-medium text-foreground">{user.user_type}</span>
            </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-light text-foreground flex items-center gap-2 mb-4">
            <BuildingOffice2Icon className="h-6 w-6 text-accent" />
            Owned Accounts ({accounts.length})
        </h2>
        <div className="bg-[#333333] shadow-md rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-light text-muted-foreground sm:pl-6">Account Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-light text-muted-foreground">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#333333]">
                        {accounts.length > 0 ? accounts.map((account) => (
                            <tr 
                                key={account.id} 
                                className="hover:bg-[#2E2E2E] transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/admin/accounts/${account.id}`)}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-light text-accent hover:underline sm:pl-6">{account.fields['Account Name']}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{account.fields['Account Type']}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="2" className="py-8 text-center text-muted-foreground">This user does not own any accounts.</td>
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