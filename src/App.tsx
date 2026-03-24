import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] flex flex-col items-center justify-center relative overflow-hidden font-mono uppercase crt-flicker">
      <div className="static-noise"></div>
      <div className="scanlines"></div>

      <div className="z-10 flex flex-col items-center justify-center w-full max-w-7xl p-4 lg:flex-row lg:justify-between lg:items-stretch gap-8 h-full min-h-screen">
        
        {/* Left/Top Area: Game */}
        <div className="flex-1 w-full flex items-center justify-center min-h-[600px] border-4 border-[#f0f] relative bg-black shadow-[0_0_20px_#f0f_inset]">
          <div className="absolute top-0 left-0 bg-[#f0f] text-black px-4 py-1 text-xl font-bold tracking-widest">SYS.MODULE.01 // SNAKE_PROTOCOL</div>
          <div className="absolute bottom-0 right-0 bg-[#f0f] text-black px-4 py-1 text-xl font-bold tracking-widest">STATUS: ACTIVE</div>
          <SnakeGame />
        </div>

        {/* Right/Bottom Area: Music Player */}
        <div className="w-full lg:w-[450px] flex-shrink-0 flex items-center justify-center border-4 border-[#0ff] relative bg-black shadow-[0_0_20px_#0ff_inset]">
          <div className="absolute top-0 left-0 bg-[#0ff] text-black px-4 py-1 text-xl font-bold tracking-widest">SYS.MODULE.02 // AUDIO_STREAM</div>
          <div className="absolute bottom-0 right-0 bg-[#0ff] text-black px-4 py-1 text-xl font-bold tracking-widest">FREQ: 89.2MHz</div>
          <MusicPlayer />
        </div>
        
      </div>
    </div>
  );
}
