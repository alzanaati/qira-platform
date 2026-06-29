'use client';
import { Participant } from 'livekit-client';
import { useParticipants } from '@livekit/components-react';
import { MicOff } from 'lucide-react';
interface ParticipantBoxProps { participant: Participant; isHost?: boolean; label?: string; }
export default function ParticipantBox({ participant, isHost, label }: ParticipantBoxProps) {
  const participants = useParticipants();
  const isSpeaking = participant.isSpeaking;
  const isMuted = participant.isMicrophoneEnabled === false;
  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-800 aspect-video
      ${isSpeaking ? 'ring-2 ring-green-400' : 'ring-1 ring-gray-700'}`}>
      <video ref={el => { if (el && participant.videoTrackPublications.size > 0) {
        const track = Array.from(participant.videoTrackPublications.values())[0]?.videoTrack;
        if (track) track.attach(el);
      }}} autoPlay muted playsInline className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        {participant.videoTrackPublications.size === 0 && (
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white">
            {participant.name?.[0]?.toUpperCase() || '؟'}
          </div>
        )}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
          {isMuted && <MicOff size={10} className="text-red-400" />}
          <span className="text-white text-xs truncate max-w-[6rem]">
            {label || participant.name || 'مشارك'}
          </span>
          {isHost && <span className="text-yellow-400 text-xs ml-1">مضيف</span>}
        </div>
        {isSpeaking && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
      </div>
    </div>
  );
}
