import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_0x001_PULSE",
    artist: "SYNTH_CORE_99",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "CYBER_DREAM_SEQ",
    artist: "NEURAL_NET_V4",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "HORIZON_OVERRIDE",
    artist: "ALGO_AUDIO_SYS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percent = x / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-4 border-[#0ff] p-8 pt-16 shadow-[0_0_15px_#0ff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="mb-8 border-b-4 border-[#0ff] pb-4">
        <h2 className="text-4xl font-black tracking-widest text-[#0ff] glitch-text mb-2" data-text="AUDIO_STREAM">
          AUDIO_STREAM
        </h2>
        <div className="text-xl text-[#f0f] animate-pulse">
          {isPlaying ? "STATUS: TRANSMITTING..." : "STATUS: STANDBY"}
        </div>
      </div>

      <div className="mb-8 border-4 border-[#f0f] p-4 bg-[#111]">
        <div className="text-2xl text-[#0ff] mb-2 truncate">
          FILE: {currentTrack.title}.WAV
        </div>
        <div className="text-xl text-[#f0f] truncate">
          SRC: {currentTrack.artist}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="text-[#0ff] mb-2 text-lg">BUFFER_PROGRESS: {Math.round(progress)}%</div>
        <div 
          className="h-6 bg-[#222] border-2 border-[#0ff] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#0ff] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-4 border-[#0ff] p-2">
          <button 
            onClick={prevTrack}
            className="px-4 py-2 text-xl text-black bg-[#0ff] hover:bg-[#f0f] hover:text-white transition-colors"
          >
            &lt;&lt; PRV
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-8 py-2 text-2xl font-bold text-black bg-[#f0f] hover:bg-[#0ff] transition-colors"
          >
            {isPlaying ? "HALT" : "EXEC"}
          </button>
          
          <button 
            onClick={nextTrack}
            className="px-4 py-2 text-xl text-black bg-[#0ff] hover:bg-[#f0f] hover:text-white transition-colors"
          >
            NXT &gt;&gt;
          </button>
        </div>

        <div className="flex items-center gap-4 border-4 border-[#f0f] p-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-xl text-[#f0f] hover:text-[#0ff] transition-colors w-16"
          >
            {isMuted ? "MUTED" : "VOL"}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="flex-1 h-4 appearance-none bg-[#222] border-2 border-[#f0f] cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[#0ff]"
          />
        </div>
      </div>
    </div>
  );
}
