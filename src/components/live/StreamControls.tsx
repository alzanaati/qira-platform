'use client';
import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Settings } from 'lucide-react';
interface StreamControlsProps {
  isHost: boolean;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
  onScreenShare?: () => void;
  onEndStream?: () => void;
  micEnabled?: boolean;
  cameraEnabled?: boolean;
  screenSharing?: boolean;
}
export default function StreamControls({
  isHost, onToggleMic, onToggleCamera, onScreenShare, onEndStream,
  micEnabled = true, cameraEnabled = true, screenSharing = false
}: StreamControlsProps) {
  const [confirmEnd, setConfirmEnd] = useState(false);
  const btn = 'flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-sm';
  const active = 'bg-gray-700 hover:bg-gray-600 text-white';
  const inactive = 'bg-red-900/50 hover:bg-red-900/70 text-red-400';
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gray-900/95 backdrop-blur">
      <button onClick={onToggleMic} className={`${btn} ${micEnabled ? active : inactive}`}>
        {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        <span className="text-xs">{micEnabled ? 'ÙÙÙØ±ÙÙÙÙ' : 'ØµØ§ÙØª'}</span>
      </button>
      {isHost && (
        <button onClick={onToggleCamera} className={`${btn} ${cameraEnabled ? active : inactive}`}>
          {cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          <span className="text-xs">{cameraEnabled ? 'ÙØ§ÙÙØ±Ø§' : 'Ø¥ÙÙØ§Ù'}</span>
        </button>
      )}
      {isHost && (
        <button onClick={onScreenShare} className={`${btn} ${screenSharing ? 'bg-blue-700 hover:bg-blue-800 text-white' : active}`}>
          <MonitorUp size={20} />
          <span className="text-xs">{screenSharing ? 'Ø¥ÙÙØ§Ù Ø§ÙÙØ´Ø§Ø±ÙØ©' : 'ÙØ´Ø§Ø±ÙØ© Ø§ÙØ´Ø§Ø´Ø©'}</span>
        </button>
      )}
      {isHost && (
        <div className="relative">
          {!confirmEnd ? (
            <button onClick={() => setConfirmEnd(true)} className={`${btn} bg-red-700 hover:bg-red-800 text-white`}>
              <PhoneOff size={20} />
              <span className="text-xs">Ø¥ÙÙØ§Ø¡</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 bg-gray-800 border border-red-700 rounded-2xl p-3">
              <span className="text-white text-xs text-center">Ø¥ÙÙØ§Ø¡ Ø§ÙØ¨Ø«Ø</span>
              <div className="flex gap-2">
                <button onClick={onEndStream} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs">ÙØ¹Ù</button>
                <button onClick={() => setConfirmEnd(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs">ÙØ§</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
