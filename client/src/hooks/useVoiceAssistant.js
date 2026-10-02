import { useState, useRef, useCallback } from 'react';

// Resample Float32 from srcRate to 16kHz for Gemini input
function resampleTo16k(float32, srcRate) {
    if (srcRate === 16000) return float32;
    const ratio = srcRate / 16000;
    const outLen = Math.round(float32.length / ratio);
    const out = new Float32Array(outLen);
    for (let i = 0; i < outLen; i++) {
        const src = i * ratio;
        const lo = Math.floor(src);
        const hi = Math.min(lo + 1, float32.length - 1);
        const frac = src - lo;
        out[i] = float32[lo] * (1 - frac) + float32[hi] * frac;
    }
    return out;
}

// Convert Float32 to Int16 PCM
function float32ToInt16(float32) {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        int16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32767));
    }
    return int16;
}

// Play raw 16-bit PCM using AudioContext
function createPcmPlayer(audioCtx) {
    let nextPlayTime = 0;

    function queuePcm(int16Array) {
        const f32 = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) f32[i] = int16Array[i] / 32768;

        const buf = audioCtx.createBuffer(1, f32.length, 24000);
        buf.copyToChannel(f32, 0);

        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);

        // Schedule each Gemini chunk after the previous one to avoid overlap and distortion.
        const startTime = Math.max(audioCtx.currentTime, nextPlayTime);
        src.start(startTime);
        nextPlayTime = startTime + buf.duration;
    }

    return { queuePcm };
}

export const useVoiceAssistant = (userId, storeId, options = {}) => {
    const { onAiText, onAiTranscript, onUserTranscript, onTurnComplete } = options;
    const onAiTextRef = useRef(onAiText);
    const onAiTranscriptRef = useRef(onAiTranscript);
    const onUserTranscriptRef = useRef(onUserTranscript);
    const onTurnCompleteRef = useRef(onTurnComplete);

    onAiTextRef.current = onAiText;
    onAiTranscriptRef.current = onAiTranscript;
    onUserTranscriptRef.current = onUserTranscript;
    onTurnCompleteRef.current = onTurnComplete;

    const [isConnected, setIsConnected] = useState(false);
    const [isReady, setIsReady]         = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMuted, setIsMuted]         = useState(false);
    const [permissionError, setPermissionError] = useState('');

    const wsRef          = useRef(null);
    const audioCtxRef    = useRef(null);
    const pcmPlayerRef   = useRef(null);
    const mediaStreamRef = useRef(null);
    const processorRef   = useRef(null);
    const sourceRef      = useRef(null);
    const mutedRef       = useRef(false);

    const getAudioCtx = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            pcmPlayerRef.current = createPcmPlayer(audioCtxRef.current);
        }
        return audioCtxRef.current;
    };

    const connect = useCallback(() => {
        if (wsRef.current) return;

        if (!userId || !storeId) {
            console.warn('[Voice] Missing userId or storeId; socket connection skipped.');
            return;
        }

        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
            .replace(/\/api\/?$/, '');
        const wsUrl = new URL('/ws/voice', apiBaseUrl.replace(/^http/, 'ws'));
        wsUrl.searchParams.set('user_id', String(userId));
        wsUrl.searchParams.set('store_id', String(storeId));

        const ws = new WebSocket(wsUrl.toString());
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[Voice] WS connected — waiting for Gemini setup...');
            setIsConnected(true);
            // Resume AudioContext after user gesture
            getAudioCtx();
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                // Raw PCM from Gemini — play it
                if (pcmPlayerRef.current) {
                    const int16 = new Int16Array(event.data);
                    pcmPlayerRef.current.queuePcm(int16);
                }
            } else if (typeof event.data === 'string') {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'ready') {
                        console.log('[Voice] Gemini ready');
                        setIsReady(true);
                    } else if (msg.type === 'audio_received') {
                        console.log('[Voice] Backend forwarded audio to Gemini', msg.chunks, 'chunks');
                    } else if (msg.type === 'ai_text') {
                        onAiTextRef.current?.(msg.text);
                    } else if (msg.type === 'ai_transcript') {
                        onAiTranscriptRef.current?.(msg.text);
                    } else if (msg.type === 'user_transcript') {
                        onUserTranscriptRef.current?.(msg.text);
                    } else if (msg.type === 'turn_complete') {
                        onTurnCompleteRef.current?.();
                    } else if (msg.type === 'tool_start') {
                        optionsRef.current?.onToolStart?.(msg);
                    } else if (msg.type === 'tool_complete') {
                        optionsRef.current?.onToolComplete?.(msg);
                    }
                } catch (_) {}
            }
        };

        ws.onerror = (e) => console.error('[Voice] WS error', e);

        ws.onclose = () => {
            console.log('[Voice] WS closed');
            setIsConnected(false);
            setIsReady(false);
            stopRecordingImpl();
            wsRef.current = null;
        };
    }, [userId, storeId]);

    const disconnect = useCallback(() => {
        stopRecordingImpl();
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
        pcmPlayerRef.current = null;
        setIsConnected(false);
        setIsReady(false);
        setIsMuted(false);
    }, []);

    function stopRecordingImpl() {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'audio_stream_end' }));
        }
        processorRef.current?.disconnect();
        processorRef.current = null;
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        mediaStreamRef.current?.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        setIsRecording(false);
        mutedRef.current = false;
        setIsMuted(false);
    }

    const startRecording = useCallback(async () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        if (isRecording) return;

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Microphone is not supported in this browser.');
            }

            const ctx = getAudioCtx();
            if (ctx.state === 'suspended') await ctx.resume();

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000,
                }
            });
            mediaStreamRef.current = stream;
            setPermissionError('');

            const source = ctx.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = ctx.createScriptProcessor(2048, 1, 1);
            processor.onaudioprocess = (e) => {
                if (mutedRef.current) return;
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
                const raw = e.inputBuffer.getChannelData(0);
                const resampled = resampleTo16k(raw, ctx.sampleRate);
                const pcm = float32ToInt16(resampled);
                const payload = pcm.buffer.slice(0);
                wsRef.current.send(payload);
                console.log('[Voice] Sent audio chunk', payload.byteLength);
            };

            source.connect(processor);
            processor.connect(ctx.destination);
            processorRef.current = processor;
            setIsRecording(true);
            mutedRef.current = false;
            setIsMuted(false);
            console.log('[Voice] Recording started');
        } catch (err) {
            console.error('[Voice] Mic error:', err);
            setPermissionError('Microphone permission is blocked. Please enable the microphone for this site in the browser settings and try again.');
            stopRecordingImpl();
        }
    }, [isMuted, isRecording]);

    const stopRecording = useCallback(() => {
        stopRecordingImpl();
    }, []);

    const toggleMute = useCallback(() => {
        if (!isRecording) return;

        const nextMuted = !isMuted;
        mutedRef.current = nextMuted;
        mediaStreamRef.current?.getAudioTracks().forEach(track => {
            track.enabled = !nextMuted;
        });
        if (nextMuted && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'audio_stream_end' }));
        }
        setIsMuted(nextMuted);
    }, [isMuted, isRecording]);

    return {
        isConnected,
        isReady,
        isRecording,
        isMuted,
        permissionError,
        connect,
        disconnect,
        startRecording,
        stopRecording,
        toggleMute,
    };
};
