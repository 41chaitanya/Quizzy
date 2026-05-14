import React from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-zinc-900 flex items-center justify-center p-4">
      {/* You can add a common Navbar or Footer here later if needed */}
      <Outlet />
    </div>
  );
};

export default Layout;
