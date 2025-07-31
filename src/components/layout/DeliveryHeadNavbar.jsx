import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Utility function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default function DeliveryHeadNavbar() {
  const [userInitials, setUserInitials] = useState('');
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("userName");
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
    { name: 'Dashboard', href: '/delivery-head/dashboard' },
    { name: 'All Project Deliveries', href: '/delivery-head/projects' },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('secretKey');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center bg-card shadow-md border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link to="/delivery-head/dashboard" className="hover:opacity-80 transition-opacity">
                 <img
                    className="h-8 w-auto"
                    src="/rian-logo-footer.svg"
                    alt="Rian Logo"
                  />
              </Link>
            </div>
            
            {/* Main Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="relative inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          layoutId="delivery-head-underline"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Right-side User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold border border-border">
                    {userInitials}
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-secondary py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.href}
                          className={cn(
                            active ? 'bg-card' : '',
                            'block px-4 py-2 text-sm text-foreground'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/login"
                        onClick={handleLogout}
                        className={cn(
                          active ? 'bg-card' : '',
                          'flex items-center px-4 py-2 text-sm text-foreground'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                        Sign out
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}