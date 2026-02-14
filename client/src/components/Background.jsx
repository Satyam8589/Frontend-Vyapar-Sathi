'use client';

import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      {/* Static Radial Gradient Base */}
      <div className="absolute inset-0 bg-rad-yb opacity-100"></div>

      {/* Scattered Small Dark Yellow Blurry Dots */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] animate-blob"></div>
      <div className="absolute top-[60%] left-[80%] w-40 h-40 bg-yellow-600/10 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
      <div className="absolute top-[10%] right-[15%] w-24 h-24 bg-amber-400/10 rounded-full blur-[50px] animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[20%] left-[30%] w-36 h-36 bg-yellow-700/10 rounded-full blur-[70px] animate-blob"></div>
      <div className="absolute top-[40%] left-[50%] w-28 h-28 bg-amber-600/10 rounded-full blur-[60px] animate-blob animation-delay-2000"></div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] contrast-150 brightness-100"></div>

      {/* Static Mesh Overlay */}
      <div className="absolute inset-0 bg-mesh-light opacity-50"></div>
    </div>
  );
};

export default Background;
