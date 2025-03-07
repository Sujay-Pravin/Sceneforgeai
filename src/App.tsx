import React, { useState } from 'react';
import { FileText, Upload, Video, Wand2, ChevronDown, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainEditor from './components/MainEditor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <main>
        <Hero />
        <MainEditor />
      </main>
    </div>
  );
}

export default App;