import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Transform Your <span className="text-blue-400">Ideas</span> into Cinematic Reality
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Create compelling scenes with AI-powered suggestions and video generation.
          Upload text or documents and watch your story come to life.
        </p>
        <button className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center mx-auto">
          Start Creating Now
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default Hero;