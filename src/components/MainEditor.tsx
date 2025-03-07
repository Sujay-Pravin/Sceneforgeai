import React, { useState } from 'react';
import { getAISuggestions } from './groqApi'; // Import the API function
import { FileText, Upload, Video, Wand2, ChevronDown } from 'lucide-react';

const TONE_OPTIONS = [
  'Professional',
  'Casual',
  'Dramatic',
  'Comedic',
  'Mysterious',
  'Romantic',
  'Documentary',
];

const MainEditor = () => {
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [selectedTone, setSelectedTone] = useState(TONE_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [aiSuggestions, setAISuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!scriptText.trim()) {
      alert('Please enter a script before submitting.');
      return;
    }

    setLoading(true);
    setAISuggestions('Generating AI scene breakdown...');

    try {
      const suggestions = await getAISuggestions(scriptText);
      setAISuggestions(suggestions);
      setIsGenerating(true);

      const response = await fetch('http://localhost:2000/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: suggestions }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Set video URL for preview
        setVideoUrl('/output/final_video.mp4');
      } else {
        console.error('Video generation failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAISuggestions('Failed to generate scene breakdown.');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-video.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Input</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setInputType('text')}
                className={`p-2 rounded ${
                  inputType === 'text' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`p-2 rounded ${
                  inputType === 'file' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
          </div>

          {inputType === 'text' ? (
            <textarea
              className="w-full h-64 bg-slate-700/50 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your scene description here..."
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
            />
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Drop your document here or click to browse</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-slate-700/50 text-white py-2 px-4 rounded-lg flex items-center justify-between"
              >
                <span>{selectedTone}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute w-full mt-2 bg-slate-700 rounded-lg shadow-xl z-10">
                  {TONE_OPTIONS.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => {
                        setSelectedTone(tone);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </div>

        {/* AI Suggestions Section */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Wand2 className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">AI Suggestions</h2>
          </div>
          <textarea
            className="w-full h-64 bg-slate-700/50 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AI suggestions will appear here..."
            value={aiSuggestions}
            readOnly
          />
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>

        {/* Video Preview Section */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Video className="h-6 w-6 text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Video Preview</h2>
          </div>
          <div className="bg-slate-700/50 rounded-lg h-64 flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-400">Generating video...</p>
              </div>
            ) : videoUrl ? (
              <video 
                className="w-full h-full object-contain"
                controls
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-gray-400">Video preview will appear here</p>
            )}
          </div>
          <div className="mt-4">
            <button 
              onClick={handleDownload}
              disabled={!videoUrl}
              className={`w-full ${
                videoUrl 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 cursor-not-allowed'
              } text-white py-2 px-4 rounded-lg transition-colors`}
            >
              {videoUrl ? 'Download Video' : 'No Video Available'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainEditor;