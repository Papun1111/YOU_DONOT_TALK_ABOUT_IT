import {type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * The main layout component that wraps every page.
 * It provides the consistent dark, glitchy theme, navbar, and footer.
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col font-mono selection:bg-red-500 selection:text-white">
      {/* Optional: Add a subtle animated background for the glitch effect */}
      <div className="fixed inset-0 w-full h-full bg-[url('/scanlines.png')] opacity-10 motion-safe:animate-pulse z-0"></div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
