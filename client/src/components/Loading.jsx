import React from 'react';

function Loading({ fullScreen = true, message = "Loading..." }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
}

export default Loading;