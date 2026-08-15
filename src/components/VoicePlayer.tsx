import { useRef, useState, useEffect } from 'react';
import { Volume2, Pause, Square, RotateCcw } from 'lucide-react';

interface VoicePlayerProps {
  text: string;
  label?: string;
}

export function VoicePlayer({ text, label = 'Listen' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => handlePlay(), 80);
  };

  if (!('speechSynthesis' in window)) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-1">
      {!isPlaying && !isPaused && (
        <button onClick={handlePlay} className="flex items-center gap-2 rounded-md bg-primary-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-800">
          <Volume2 className="h-4 w-4" />
          {label}
        </button>
      )}
      {isPlaying && (
        <button onClick={handlePause} className="flex items-center gap-2 rounded-md bg-primary-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-800">
          <Pause className="h-4 w-4" />
          Pause
        </button>
      )}
      {isPaused && (
        <button onClick={handlePlay} className="flex items-center gap-2 rounded-md bg-primary-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-800">
          <Volume2 className="h-4 w-4" />
          Resume
        </button>
      )}
      {(isPlaying || isPaused) && (
        <>
          <button onClick={handleStop} className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="Stop">
            <Square className="h-4 w-4" />
          </button>
          <button onClick={handleRestart} className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="Restart">
            <RotateCcw className="h-4 w-4" />
          </button>
        </>
      )}
      <select
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="rounded-md border-0 bg-transparent px-1.5 py-1 text-xs text-gray-500 outline-none cursor-pointer hover:text-gray-700"
        aria-label="Playback speed"
      >
        <option value={0.5}>0.5×</option>
        <option value={0.75}>0.75×</option>
        <option value={1}>1×</option>
        <option value={1.25}>1.25×</option>
      </select>
    </div>
  );
}
