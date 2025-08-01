import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, Bars3Icon as MenuAlt1Icon, PlusIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link, useLocation } from 'react-router-dom';

// Utility function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default function Navbar({ setSidebarOpen }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('');
  const [userRole, setUserRole] = useState(''); // New state for user role

  const location = useLocation();
  const onLoginPage = location.pathname === '/login';

  useEffect(() => {
    const user = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole"); // Get role from local storage
    setIsLoggedIn(!!user);
    setUserRole(role); // Set the user role
    if (user) {
        const names = user.split(' ');
        if (names.length > 1) {
            setUserInitials((names[0][0] + names[names.length - 1][0]).toUpperCase());
        } else if (names.length === 1 && names[0].length > 0) {
            setUserInitials(names[0][0].toUpperCase());
        }
    }
  }, [location]);

  // Navigation items for sales executives
  const salesExecutiveNavigation = [
    { name: 'Home', href: '/home' }, // Changed to /home for consistency
    { name: 'Accounts', href: '/accounts' },
    { name: 'Projects', href: '/projects' },
    { name: 'Updates', href: '/updates' },
    { name: 'Orders', href: '/delivery' }, // New Delivery link
  ];

  const tasksNavigation = [
    { name: 'View Assigned Tasks', href: '/tasks' },
    { name: 'My Tasks', href: '/my-tasks' },
    { name: 'Create New Task', href: '/create-task' },
  ];
  
  const createNavigation = [
    { name: 'New Account', href: '/create-account' },
    { name: 'New Project', href: '/create-project' },
    { name: 'New Update', href: '/create-update' },
    { name: 'New Task', href: '/create-task' },
    { name: 'New Order', href: '/delivery/create' }, // New Quick Create for Delivery Status
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' }, // Placeholder, not implemented yet
    { name: 'Sign out', href: '/login' }, // Sign out redirects to login
  ];

  // If on login page or not logged in, show a simple navbar with the logo on the left.
  if (onLoginPage || !isLoggedIn) {
    return (
      <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center bg-card shadow-md">
        <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center space-x-2">
                <img
                className="h-8 w-auto"
                src="/rian-logo-footer.svg"
                alt="Rian Logo"
                />
            </Link>
        </div>
      </header>
    );
  }

  // For logged-in users, only render the full navbar for 'sales_executive'
  if (userRole !== 'sales_executive') {
    return null; 
  }

  // Render the full functional navbar for sales executives
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center bg-card shadow-md">
      
      {/* Mobile sidebar toggle button */}
      <button
        type="button"
        className="border-r border-border px-4 text-muted-foreground md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              className="h-8 w-auto"
              src="/rian-logo-footer.svg"
              alt="Rian Logo"
            />
          </Link>

          {/* Main Navigation for Sales Executive */}
          <nav className="hidden md:flex items-center space-x-4">
            {salesExecutiveNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-light text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150"
              >
                {item.name}
              </Link>
            ))}

            {/* Tasks Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-md px-3 py-2 text-sm font-light text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors duration-150">
                <span>Tasks</span>
                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-card py-1 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
                  {tasksNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.href}
                          className={cn(
                            active ? 'bg-secondary' : '',
                            'block px-4 py-2 text-sm text-foreground'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </nav>
        </div>

        {/* Right-side icons (Quick Create, Notifications, User Menu) */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Quick Create Dropdown */}
          <Menu as="div" className="relative">
             <Menu.Button className="rounded-full bg-card p-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-card transition-colors duration-150">
                <span className="sr-only">Quick Create</span>
                <PlusIcon className="h-6 w-6" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
                {createNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        to={item.href}
                        className={cn(
                          active ? 'bg-secondary' : '',
                          'block px-4 py-2 text-sm text-foreground'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Notifications Button (Placeholder) */}
          <button
            type="button"
            className="rounded-full bg-card p-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-card transition-colors duration-150"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* User Profile Dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex max-w-xs items-center rounded-full bg-card text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-card">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold border border-border">
                  {userInitials}
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        to={item.href}
                        className={cn(
                          active ? 'bg-secondary' : '',
                          'block px-4 py-2 text-sm text-foreground'
                        )}
                        onClick={() => {
                            if (item.name === 'Sign out') {
                                localStorage.clear();
                            }
                        }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}