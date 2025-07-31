import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BriefcaseIcon, ClipboardDocumentListIcon, BuildingOffice2Icon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { fetchAllUsersForAdmin, fetchAllProjectsForAdmin, fetchAllTasksForAdmin, fetchAllAccountsForAdmin, fetchAllUpdatesForAdmin } from '../api';
import { ShineBorder } from '../components/ui/ShineBorder';

// Updated StatCard to match the user-side dashboard
const StatCard = ({ title, value, icon, to }) => (
  <Link 
    to={to} 
    className="block group relative"
  >
    <div className="bg-[#333333] border border-border rounded-2xl p-6 transition-all duration-300 group-hover:bg-[#3a3a3a]">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                {React.cloneElement(icon, { className: "h-6 w-6 text-muted-foreground"})}
                <h3 className="text-md font-light text-foreground ml-3">{title}</h3>
            </div>
            <p className="text-3xl font-light text-foreground">{value}</p>
        </div>
    </div>
    <ShineBorder 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        borderWidth={1}
        shineColor={["#67F5C8", "#ADFF15", "#F1FA38"]}
    />
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ userCount: 0, projectCount: 0, taskCount: 0, accountCount: 0, updateCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminName = localStorage.getItem("userName") || "Admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [users, projects, tasks, accounts, updates] = await Promise.all([
          fetchAllUsersForAdmin(),
          fetchAllProjectsForAdmin(),
          fetchAllTasksForAdmin(),
          fetchAllAccountsForAdmin(),
          fetchAllUpdatesForAdmin()
        ]);
        setStats({
          userCount: users.length,
          projectCount: projects.length,
          taskCount: tasks.length,
          accountCount: accounts.length,
          updateCount: updates.length
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-light text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back, {adminName}. Here's an overview of the platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.userCount} 
          icon={<UsersIcon />}
          to="/admin/users"
        />
        <StatCard 
          title="Total Accounts" 
          value={stats.accountCount} 
          icon={<BuildingOffice2Icon />}
          to="/admin/accounts"
        />
        <StatCard 
          title="Total Projects" 
          value={stats.projectCount} 
          icon={<BriefcaseIcon />}
          to="/admin/projects"
        />
        <StatCard 
          title="Total Tasks" 
          value={stats.taskCount} 
          icon={<ClipboardDocumentListIcon />}
          to="/admin/tasks"
        />
        <StatCard 
          title="Total Updates" 
          value={stats.updateCount} 
          icon={<ChatBubbleBottomCenterTextIcon />}
          to="/admin/updates"
        />
      </div>
    </div>
  );
}