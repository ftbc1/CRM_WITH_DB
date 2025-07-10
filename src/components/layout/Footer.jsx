<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';

/* IMPORTANT: Ensure the "Inter" font is linked in your main HTML file,
  as mentioned in the Navbar update, for consistent typography.
*/

export default function Footer() {
  return (
    // 1. Updated footer to use the dark 'card' background and 'Inter' font
    <footer 
      className="bg-card border-t border-border"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          
          {/* 2. Replaced copyright text with Rian.io logo and updated text */}
          <div className="flex items-center gap-3">
            {/* Rian.io Logo Placeholder */}
            <img
              className="h-8 w-auto" // You can adjust the height (h-8) as needed
              src="/rian-logo-footer.svg"
              alt="Rian Logo"
            />
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Rian.io. All rights reserved.
            </span>
          </div>

          {/* 3. Styled the existing links to match the new theme */}
          <div className="flex items-center space-x-6 text-sm">
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
              Help
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
              Privacy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
              Contact
            </Link>
=======
// src/components/layout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <span className="text-sm text-gray-600 font-merriweather">
            Copyright © {new Date().getFullYear()} FTB Communications PVT LTD. All rights reserved.
          </span>
          <div className="flex items-center space-x-6 text-sm text-gray-600 font-open-sans">
            <a href="#" className="hover:text-primary hover:underline">Help</a>
            <a href="#" className="hover:text-primary hover:underline">Privacy</a>
            <a href="#" className="hover:text-primary hover:underline">Contact</a>
>>>>>>> origin
          </div>
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin
