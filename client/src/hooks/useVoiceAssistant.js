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

// Compute RMS volume of Float32 audio buffer for VAD (Voice Activity Detection)
function computeRms(float32) {
    if (!float32 || float32.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < float32.length; i++) {
        sum += float32[i] * float32[i];
    }
    return Math.sqrt(sum / float32.length);
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
    const optionsRef = useRef(options);
    const onAiTextRef = useRef(onAiText);
    const onAiTranscriptRef = useRef(onAiTranscript);
    const onUserTranscriptRef = useRef(onUserTranscript);
    const onTurnCompleteRef = useRef(onTurnComplete);

    // Keep all refs current on every render (no stale-closure bugs)
    optionsRef.current = options;
    onAiTextRef.current = onAiText;
    onAiTranscriptRef.current = onAiTranscript;
    onUserTranscriptRef.current = onUserTranscript;
    onTurnCompleteRef.current = onTurnComplete;

    const [isConnected, setIsConnected] = useState(false);
    const [isReady, setIsReady]         = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMuted, setIsMuted]         = useState(false);
    const [permissionError, setPermissionError] = useState('');

    const SILENCE_THRESHOLD = 0.008; // Audio RMS threshold for voice detection
    const AUTO_END_SILENCE_MS = 1400; // Silence duration (ms) after speech to auto-end turn

    const wsRef          = useRef(null);
    const audioCtxRef    = useRef(null);
    const pcmPlayerRef   = useRef(null);
    const mediaStreamRef = useRef(null);
    const processorRef   = useRef(null);
    const sourceRef      = useRef(null);
    const mutedRef       = useRef(false);
    const hasSpokenRef   = useRef(false);
    const silenceStartRef = useRef(null);
    const sentChunksCountRef = useRef(0);

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

        const toWsOrigin = (url) => {
            try {
                const u = new URL(url);
                const proto = u.protocol === 'https:' ? 'wss:' : 'ws:';
                return `${proto}//${u.host}`;
            } catch {
                return null;
            }
        };

        let aiWsBase = null;

        if (process.env.NEXT_PUBLIC_AI_WS_URL) {
            try {
                const raw = process.env.NEXT_PUBLIC_AI_WS_URL.trim().replace(/\/+$/, '');
                if (/^wss?:\///i.test(raw)) {
                    const u = new URL(raw);
                    aiWsBase = `${u.protocol}//${u.host}`;
                } else {
                    aiWsBase = toWsOrigin(raw);
                }
            } catch { aiWsBase = null; }
            console.log('[Voice] URL source: NEXT_PUBLIC_AI_WS_URL →', aiWsBase);
        }

        if (!aiWsBase && process.env.NEXT_PUBLIC_AI_URL) {
            aiWsBase = toWsOrigin(process.env.NEXT_PUBLIC_AI_URL.trim());
            console.log('[Voice] URL source: NEXT_PUBLIC_AI_URL →', aiWsBase);
        }

        if (!aiWsBase && process.env.NEXT_PUBLIC_API_URL) {
            aiWsBase = toWsOrigin(process.env.NEXT_PUBLIC_API_URL.trim());
            console.warn('[Voice] Falling back to NEXT_PUBLIC_API_URL origin for WS —', aiWsBase);
        }

        if (!aiWsBase) {
            aiWsBase = 'ws://localhost:8080';
            console.warn('[Voice] No AI URL env var found. Using localhost fallback.');
        }

        const wsUrl = new URL('/ws/voice', aiWsBase);
        wsUrl.searchParams.set('user_id', String(userId));
        wsUrl.searchParams.set('store_id', String(storeId));
        console.log('[Voice] Connecting to:', wsUrl.toString());

        const ws = new WebSocket(wsUrl.toString());
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[Voice] WS connected — waiting for Gemini setup...');
            setIsConnected(true);
            getAudioCtx();
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
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
        hasSpokenRef.current = false;
        silenceStartRef.current = null;
        sentChunksCountRef.current = 0;
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

            hasSpokenRef.current = false;
            silenceStartRef.current = null;
            sentChunksCountRef.current = 0;

            const processor = ctx.createScriptProcessor(2048, 1, 1);
            processor.onaudioprocess = (e) => {
                if (mutedRef.current) return;
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

                const raw = e.inputBuffer.getChannelData(0);
                const resampled = resampleTo16k(raw, ctx.sampleRate);
                const rms = computeRms(resampled);
                const isVoiceActive = rms >= SILENCE_THRESHOLD;
                const now = Date.now();

                if (isVoiceActive) {
                    hasSpokenRef.current = true;
                    silenceStartRef.current = null;
                } else if (hasSpokenRef.current) {
                    if (!silenceStartRef.current) {
                        silenceStartRef.current = now;
                    } else if (now - silenceStartRef.current > AUTO_END_SILENCE_MS) {
                        console.log('[Voice] VAD: Silence threshold reached after speech. Auto-ending turn.');
                        wsRef.current.send(JSON.stringify({ type: 'audio_stream_end' }));
                        hasSpokenRef.current = false;
                        silenceStartRef.current = null;
                        return;
                    }
                }

                // Skip sending continuous background silence before user speaks
                if (!hasSpokenRef.current && !isVoiceActive) {
                    return;
                }

                const pcm = float32ToInt16(resampled);
                const payload = pcm.buffer.slice(0);
                wsRef.current.send(payload);

                sentChunksCountRef.current += 1;
                if (sentChunksCountRef.current === 1 || sentChunksCountRef.current % 25 === 0) {
                    console.log('[Voice] Sent audio chunk', sentChunksCountRef.current, 'RMS:', rms.toFixed(4));
                }
            };

            source.connect(processor);
            processor.connect(ctx.destination);
            processorRef.current = processor;
            setIsRecording(true);
            mutedRef.current = false;
            setIsMuted(false);
            console.log('[Voice] Recording started with VAD');
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

    const sendTextMessage = useCallback((text) => {
        if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({
            type: 'user_text',
            text: text.trim(),
        }));
    }, []);

    const sendImageInput = useCallback((base64Data, mimeType = 'image/jpeg', textCaption = '') => {
        if (!base64Data || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        let cleanB64 = base64Data;
        let finalMime = mimeType;
        if (base64Data.startsWith('data:')) {
            const parts = base64Data.split(',');
            finalMime = parts[0].split(';')[0].replace('data:', '') || mimeType;
            cleanB64 = parts[1];
        }
        wsRef.current.send(JSON.stringify({
            type: 'image_input',
            mime_type: finalMime,
            data: cleanB64,
            text: textCaption ? textCaption.trim() : '',
        }));
    }, []);

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
        sendTextMessage,
        sendImageInput,
    };
};
