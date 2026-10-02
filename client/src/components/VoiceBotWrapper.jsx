'use client';

import dynamic from 'next/dynamic';

// VoiceBot uses browser-only APIs (WebSocket, AudioContext, MediaDevices)
// so it must be dynamically imported with ssr:false inside a Client Component
const VoiceBot = dynamic(() => import('./VoiceBot'), { ssr: false });

export default function VoiceBotWrapper() {
  return <VoiceBot />;
}
