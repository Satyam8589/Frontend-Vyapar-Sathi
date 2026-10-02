'use client';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from 'lucide-react';

export default function VoiceBot() {
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();

    // Extract storeId from URL: /storeDashboard/[storeId]/...
    const storeId = useMemo(() => {
        const match = pathname?.match(/\/storeDashboard\/([^/]+)/);
        return match ? match[1] : null;
    }, [pathname]);

    // Real user ID from Firebase Auth
    const userId = user?.uid ?? null;

    // Only show on store dashboard pages where we have both IDs
    const isOnDashboard = Boolean(storeId && userId && isAuthenticated);

    const { isConnected, isReady, isRecording, isMuted, permissionError, connect, disconnect, startRecording, stopRecording, toggleMute } =
        useVoiceAssistant(userId, storeId);

    // Don't render on auth pages or without valid context
    if (!isOnDashboard) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {permissionError && (
                <div className="max-w-xs rounded-lg bg-red-600/90 px-3 py-2 text-xs text-white shadow-lg">
                    {permissionError}
                </div>
            )}

            {!isConnected ? (
                <button
                    type="button"
                    onClick={connect}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
                    title="Connect Voice Assistant"
                >
                    <Volume2 size={24} />
                </button>
            ) : !isReady ? (
                // Connected to WS but Gemini setup not complete yet
                <div className="bg-yellow-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center animate-pulse" title="Connecting to AI...">
                    <Volume2 size={24} />
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'} text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all`}
                        title={isRecording ? 'Stop microphone' : 'Start microphone'}
                    >
                        {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleMute}
                            disabled={!isRecording}
                            className="bg-gray-800 text-gray-200 p-2 rounded-full shadow disabled:cursor-not-allowed disabled:opacity-50"
                            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button
                            type="button"
                            onClick={disconnect}
                            className="bg-gray-800 text-gray-200 p-2 rounded-full shadow"
                            title="Disconnect voice assistant"
                        >
                            <PhoneOff size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


