import React, { useState, useEffect } from 'react';
import avoidImage from '../assets/avoidImage.png';
import validImage from '../assets/validImage.png';

const ImageGuide = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 1,
      title: "❌ Avoid Direct Grid Copy",
      image: avoidImage,
      fileName: "avoidImage.png",
      description: "Do NOT right-click and copy from the main search grid layout. This copies a massive, broken encrypted string that will crash your submission."
    },
    {
      id: 2,
      title: "✅ Use Side Preview Panel",
      image: validImage,
      fileName: "validImage.png",
      description: "Instead, click the image to open this side preview box. Right-click the image INSIDE this panel and select \"Copy image address\" for a clean URL."
    }
  ];

  // Auto-slide effect loop
  useEffect(() => {
    // If the user is hovering their mouse over the card, pause the auto-sliding feature
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 1 ? 2 : 1));
    }, 4500); // Transitions smoothly every 4.5 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-3xl p-6 shadow-xs border border-emerald-900/5 w-full max-w-95 h-fit transition-all duration-300 hover:shadow-md"
    >
      {/* Matching Header Section */}
      <div className="mb-4 pb-3 border-b border-gray-100 flex flex-col gap-1.5">
        <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800/70">
          How to Copy Image URL
        </h3>
        <div className="w-10 h-0.5 bg-[#5ea134] rounded-full"></div>
      </div>
      
      {/* Slide Container Workspace */}
      <div className="space-y-4 animate-fade-in">
        {/* Dynamic Warning / Success Status Banner */}
        <h4 className={`text-sm font-black tracking-tight transition-colors ${
          currentSlide === 1 ? 'text-red-600' : 'text-[#4c8529]'
        }`}>
          {slides[currentSlide - 1].title}
        </h4>
        
        {/* Screenshot Image Viewbox Container */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#f2f9f4]/40 p-1 group">
          <img 
            src={slides[currentSlide - 1].image} 
            alt={slides[currentSlide - 1].fileName}
            className="w-full h-auto block rounded-xl max-h-50 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Pause indicator on mouse hover context */}
          {isHovered && (
            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-widest bg-gray-900/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
              Paused
            </span>
          )}
        </div>
        
        {/* Helper Instructions Description Area */}
        <p className="text-xs font-medium text-gray-600 leading-relaxed min-h-12.5">
          {slides[currentSlide - 1].description}
        </p>
      </div>

      {/* Synchronized Footer Control Bar */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
        <button 
          onClick={() => setCurrentSlide(1)} 
          disabled={currentSlide === 1}
          className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          Prev
        </button>
        
        {/* Progress Tracker Bullets */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === 1 ? 'bg-[#5ea134] w-4' : 'bg-gray-200'}`}></span>
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === 2 ? 'bg-[#5ea134] w-4' : 'bg-gray-200'}`}></span>
        </div>

        <button 
          onClick={() => setCurrentSlide(2)} 
          disabled={currentSlide === 2}
          className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageGuide;