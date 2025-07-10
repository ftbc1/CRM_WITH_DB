<<<<<<< HEAD
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

  const location = useLocation();
  const onLoginPage = location.pathname === '/login';

  useEffect(() => {
    const user = localStorage.getItem("userName");
    setIsLoggedIn(!!user);
    if (user) {
        const names = user.split(' ');
        if (names.length > 1) {
            setUserInitials((names[0][0] + names[names.length - 1][0]).toUpperCase());
        } else if (names.length === 1 && names[0].length > 0) {
            setUserInitials(names[0][0].toUpperCase());
        }
    }
  }, [location]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Accounts', href: '/accounts' },
    { name: 'Projects', href: '/projects' },
    { name: 'Updates', href: '/updates' },
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
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Sign out', href: '/login' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center bg-card shadow-md">
      
      {isLoggedIn && !onLoginPage && (
        <button
          type="button"
          className="border-r border-border px-4 text-muted-foreground md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <img
              className="h-8 w-auto"
              src="/rian-logo-footer.svg"
              alt="Rian Logo"
            />
          </Link>

          {isLoggedIn && !onLoginPage && (
            <nav className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="rounded-md px-3 py-2 text-sm font-light text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150"
                >
                  {item.name}
                </Link>
              ))}

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
          )}
        </div>

        {isLoggedIn && !onLoginPage && (
          <div className="flex items-center space-x-2 md:space-x-4">
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

            <button
              type="button"
              className="rounded-full bg-card p-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-card transition-colors duration-150"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

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
        )}
      </div>
    </header>
  );
}
=======
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const userName = localStorage.getItem("userName") || "User";
  
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // --- Re-introducing state and refs for a timer-based hover ---
  const [showMenu, setShowMenu] = React.useState(false);
  const [showTasksMenu, setShowTasksMenu] = React.useState(false);
  const menuTimer = React.useRef(null);
  const tasksMenuTimer = React.useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- Handlers for the '+' menu ---
  const handleMenuEnter = () => {
    clearTimeout(menuTimer.current);
    setShowMenu(true);
  };
  const handleMenuLeave = () => {
    menuTimer.current = setTimeout(() => {
      setShowMenu(false);
    }, 250); // 250ms grace period
  };

  // --- Handlers for the 'Tasks' menu ---
  const handleTasksMenuEnter = () => {
    clearTimeout(tasksMenuTimer.current);
    setShowTasksMenu(true);
  };
  const handleTasksMenuLeave = () => {
    tasksMenuTimer.current = setTimeout(() => {
      setShowTasksMenu(false);
    }, 250); // 250ms grace period
  };


  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-12 h-12 mt-2 object-contain rounded"
            />
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight font-merriweather">
              Key Accounts Management
            </Link>
          </div>
          {/* Navigation Links */}
          {!isLoginPage && (
            <nav className="hidden md:flex space-x-8 text-sm font-medium font-open-sans">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-150">Home</Link>
              <Link to="/accounts" className="text-gray-700 hover:text-primary transition-colors duration-150">Accounts</Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary transition-colors duration-150">Projects</Link>
              <Link to="/updates" className="text-gray-700 hover:text-primary transition-colors duration-150">Updates</Link>
              
              <div className="relative flex items-center" onMouseEnter={handleTasksMenuEnter} onMouseLeave={handleTasksMenuLeave}>
                <button className="flex items-center text-gray-700 hover:text-primary transition-colors duration-150">
                  Tasks
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </button>
                {showTasksMenu && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-40 py-2">
                    <Link
                      to="/tasks"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Assigned Tasks
                    </Link>
                    <Link
                      to="/my-tasks"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Tasks
                    </Link>
                    <div className="border-t my-1 border-gray-100"></div>
                    <Link
                      to="/create-task"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      + Create New Task
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}
          {/* Right Side: Quick Create, User Name, User Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!isLoginPage && (
              <div className="relative" onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                <button
                  className="p-1.5 sm:p-2 rounded-full text-primary hover:bg-gray-100 transition-colors duration-150"
                  title="Quick Create"
                >
                  <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-40 py-2">
                    <Link
                      to="/create-account"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      + New Account
                    </Link>
                    <Link
                      to="/create-project"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      + New Project
                    </Link>
                    <Link
                      to="/create-update"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      + New Update
                    </Link>
                    <Link
                        to="/create-task"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        + New Task
                    </Link>
                  </div>
                )}
              </div>
            )}
            {/* User Name or Login */}
            <span className="hidden sm:inline-block text-gray-700 font-semibold font-open-sans px-2">
              {isLoginPage ? (
                <span className="text-primary font-bold">Login</span>
              ) : (
                userName
              )}
            </span>
            {/* User Menu (uses CSS group-hover, which is fine for this simple menu) */}
            {!isLoginPage && (
              <div className="relative group">
                <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 cursor-pointer hover:text-primary transition-colors duration-150" />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 py-1">
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
>>>>>>> origin
