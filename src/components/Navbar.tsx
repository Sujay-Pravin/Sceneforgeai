import React from 'react';
import { FileText } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-slate-900/50 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">SceneForge AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2">Features</a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2">Pricing</a>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;