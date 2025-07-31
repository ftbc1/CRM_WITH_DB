import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-card font-light">
      <AdminNavbar />
      <main className="flex-1 w-full">
        {/* This motion.div provides the consistent fade-in transition for all admin pages */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
            <Outlet />
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}