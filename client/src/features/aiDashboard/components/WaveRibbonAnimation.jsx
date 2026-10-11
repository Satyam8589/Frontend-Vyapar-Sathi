"use client";

import React, { useEffect, useRef } from "react";

/**
 * WaveRibbonAnimation
 * Renders the audio-reactive soundwave ribbon animation behind the 3D voice ball.
 *
 * Behaviors:
 * - Silent state: Collapses into a clean, glowing straight horizontal baseline line.
 * - Speaking state (AI speaking or user talking): The wave emerges from the straight line,
 *   dynamically modulating its amplitude and frequency according to natural vocal cadence
 *   (syllables, pitch variations, and harmonic energy).
 * - Seamless smooth transitions between silence and speech without abrupt popping.
 */
export default function WaveRibbonAnimation({
  isAISpeaking = false,
  isUserTalking = false,
  className = "",
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    phase: 0,
    currentAmp: 0, // Starts at 0 (straight line when silent)
    targetAmp: 0,
    currentSpeed: 0,
    targetSpeed: 0,
    speechTime: 0,
    currentFreqMod: 1.0,
    targetFreqMod: 1.0,
  });

  const isSpeaking = Boolean(isAISpeaking || isUserTalking);

  useEffect(() => {
    // When silent: target amplitude collapses completely to 0 (flat straight line)
    if (!isSpeaking) {
      stateRef.current.targetAmp = 0;
      stateRef.current.targetSpeed = 0;
      stateRef.current.targetFreqMod = 1.0;
    }
  }, [isSpeaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let lastTimestamp = performance.now();

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    // Envelope window: 0 at outer edges, smoothly swells in the center, tapering gracefully
    const getEnvelope = (u) => {
      const edgePadding = 0.04;
      if (u < edgePadding || u > 1 - edgePadding) return 0;
      const v = (u - edgePadding) / (1 - 2 * edgePadding);
      return Math.pow(Math.sin(Math.PI * v), 1.6);
    };

    const render = (now) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const s = stateRef.current;

      if (isSpeaking) {
        s.speechTime += dt;
        const st = s.speechTime;

        // Dynamic Speech Cadence Simulation:
        // Human/AI voice consists of syllable pulses (3-6 Hz), vocal stress, and brief micro-pauses
        const syllable1 = Math.sin(st * 4.6);
        const syllable2 = Math.sin(st * 9.2 + 0.8) * 0.4;
        const rhythm = Math.cos(st * 2.3) * 0.35;
        const microFlutter = Math.sin(st * 16.0) * 0.12;

        // Dynamic vocal energy envelope between 0.15 (pause/consonant) and 1.0 (vowel peak)
        const rawEnergy = 0.54 + syllable1 * 0.32 + syllable2 + rhythm + microFlutter;
        const vocalEnergy = Math.max(0.18, Math.min(1.0, rawEnergy));

        // AI speaking has higher, richer amplitude; user speaking has crisp responsiveness
        const maxAmp = isAISpeaking ? 40 : 32;
        s.targetAmp = maxAmp * vocalEnergy;

        // Frequency (pitch / formant) modulation over speech
        const pitchWave = 0.22 * Math.sin(st * 3.2) + 0.12 * Math.cos(st * 6.5);
        s.targetFreqMod = 1.0 + pitchWave;

        s.targetSpeed = isAISpeaking ? 0.04 : 0.032;
      } else {
        // Silent state: target amp collapses to 0
        s.targetAmp = 0;
        s.targetSpeed = 0;
        s.targetFreqMod = 1.0;
        s.speechTime = 0;
      }

      // Smooth interpolation
      s.currentAmp += (s.targetAmp - s.currentAmp) * 0.12;
      s.currentSpeed += (s.targetSpeed - s.currentSpeed) * 0.1;
      s.currentFreqMod += (s.targetFreqMod - s.currentFreqMod) * 0.1;
      s.phase += s.currentSpeed;

      // Clean snap to 0 when near silence to prevent micro-jitter
      if (s.currentAmp < 0.15 && !isSpeaking) {
        s.currentAmp = 0;
      }

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const step = 2.5;
      const totalSteps = Math.ceil(width / step);

      // -----------------------------------------------------------------
      // 1. BASELINE HORIZONTAL STRAIGHT LINE
      // Always present, glowing electric blue across the center behind the ball
      // -----------------------------------------------------------------
      const baseGrad = ctx.createLinearGradient(0, centerY, width, centerY);
      baseGrad.addColorStop(0, "rgba(147, 197, 253, 0)");
      baseGrad.addColorStop(0.1, "rgba(147, 197, 253, 0.45)");
      baseGrad.addColorStop(0.5, "rgba(96, 165, 250, 0.9)");
      baseGrad.addColorStop(0.9, "rgba(147, 197, 253, 0.45)");
      baseGrad.addColorStop(1, "rgba(147, 197, 253, 0)");

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = baseGrad;
      ctx.lineWidth = isSpeaking ? 1.4 : 1.6;
      ctx.shadowColor = "rgba(59, 130, 246, 0.55)";
      ctx.shadowBlur = isSpeaking ? 6 : 5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------
      // 2. WAVY SOUNDWAVE RIBBONS (Only visible when speaking/amplitude > 0)
      // When silent (currentAmp === 0), it stays a clean straight line!
      // -----------------------------------------------------------------
      if (s.currentAmp > 0.05) {
        // Fade in ribbon opacity smoothly as amplitude emerges from straight line
        const ribbonAlpha = Math.min(1.0, s.currentAmp / 10);

        const ribbons = [
          {
            // Primary outer ribbon (Deep glowing cerulean blue with gradient fill)
            ampScale: 1.0,
            baseFreq: 4.5,
            phaseOffset: 0,
            topGradColor: `rgba(59, 130, 246, ${0.18 * ribbonAlpha})`,
            bottomGradColor: `rgba(96, 165, 250, ${0.05 * ribbonAlpha})`,
            strokeStartAlpha: 0.85 * ribbonAlpha,
            strokeWidth: 1.6,
            harmonicWeight: 0.12,
          },
          {
            // Secondary interwoven ribbon (Slightly phase-shifted, lighter sky blue)
            ampScale: 0.78,
            baseFreq: 4.8,
            phaseOffset: Math.PI * 0.34,
            topGradColor: `rgba(96, 165, 250, ${0.15 * ribbonAlpha})`,
            bottomGradColor: `rgba(147, 197, 253, ${0.04 * ribbonAlpha})`,
            strokeStartAlpha: 0.72 * ribbonAlpha,
            strokeWidth: 1.4,
            harmonicWeight: -0.14,
          },
          {
            // Tertiary delicate ribbon (Fine harmonic breathing)
            ampScale: 0.56,
            baseFreq: 5.2,
            phaseOffset: Math.PI * 0.7,
            topGradColor: `rgba(147, 197, 253, ${0.2 * ribbonAlpha})`,
            bottomGradColor: `rgba(191, 219, 254, ${0.05 * ribbonAlpha})`,
            strokeStartAlpha: 0.62 * ribbonAlpha,
            strokeWidth: 1.2,
            harmonicWeight: 0.1,
          },
        ];

        ribbons.forEach((ribbon) => {
          const topPoints = [];
          const bottomPoints = [];
          const effectiveFreq = ribbon.baseFreq * s.currentFreqMod;

          for (let i = 0; i <= totalSteps; i++) {
            const x = Math.min(i * step, width);
            const u = x / width;
            const env = getEnvelope(u);

            // Modulated wave formula reflecting voice frequency and energy
            const theta = u * Math.PI * effectiveFreq - s.phase + ribbon.phaseOffset;
            const wave =
              Math.sin(theta) +
              Math.sin(theta * 1.5 + s.phase * 0.6) * ribbon.harmonicWeight;

            const displacement = env * s.currentAmp * ribbon.ampScale * wave;

            const yTop = centerY - displacement;
            const yBottom = centerY + displacement;

            topPoints.push({ x, y: yTop });
            bottomPoints.push({ x, y: yBottom });
          }

          // A. Fill the ribbon interior with translucent blue gradient
          ctx.beginPath();
          if (topPoints.length > 0) {
            ctx.moveTo(topPoints[0].x, topPoints[0].y);
            for (let i = 1; i < topPoints.length; i++) {
              ctx.lineTo(topPoints[i].x, topPoints[i].y);
            }
            for (let i = bottomPoints.length - 1; i >= 0; i--) {
              ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y);
            }
            ctx.closePath();

            const fillGrad = ctx.createLinearGradient(
              0,
              centerY - s.currentAmp * ribbon.ampScale,
              0,
              centerY + s.currentAmp * ribbon.ampScale
            );
            fillGrad.addColorStop(0, ribbon.topGradColor);
            fillGrad.addColorStop(0.5, `rgba(59, 130, 246, ${0.25 * ribbonAlpha})`);
            fillGrad.addColorStop(1, ribbon.bottomGradColor);

            ctx.fillStyle = fillGrad;
            ctx.fill();
          }

          // Horizontal gradient for boundary strokes fading at edges
          const strokeGrad = ctx.createLinearGradient(0, centerY, width, centerY);
          strokeGrad.addColorStop(0, "rgba(59, 130, 246, 0)");
          strokeGrad.addColorStop(0.12, `rgba(96, 165, 250, ${ribbon.strokeStartAlpha * 0.6})`);
          strokeGrad.addColorStop(0.5, `rgba(37, 99, 235, ${ribbon.strokeStartAlpha})`);
          strokeGrad.addColorStop(0.88, `rgba(96, 165, 250, ${ribbon.strokeStartAlpha * 0.6})`);
          strokeGrad.addColorStop(1, "rgba(59, 130, 246, 0)");

          // B. Stroke top boundary curve
          ctx.beginPath();
          if (topPoints.length > 0) {
            ctx.moveTo(topPoints[0].x, topPoints[0].y);
            for (let i = 1; i < topPoints.length; i++) {
              ctx.lineTo(topPoints[i].x, topPoints[i].y);
            }
          }
          ctx.strokeStyle = strokeGrad;
          ctx.lineWidth = ribbon.strokeWidth;
          ctx.shadowColor = "rgba(59, 130, 246, 0.4)";
          ctx.shadowBlur = 4;
          ctx.stroke();

          // C. Stroke bottom boundary curve
          ctx.beginPath();
          if (bottomPoints.length > 0) {
            ctx.moveTo(bottomPoints[0].x, bottomPoints[0].y);
            for (let i = 1; i < bottomPoints.length; i++) {
              ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y);
            }
          }
          ctx.strokeStyle = strokeGrad;
          ctx.lineWidth = ribbon.strokeWidth;
          ctx.shadowColor = "rgba(59, 130, 246, 0.4)";
          ctx.shadowBlur = 4;
          ctx.stroke();

          ctx.shadowBlur = 0;
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isSpeaking, isAISpeaking]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none select-none ${className}`}
      style={{ display: "block" }}
    />
  );
}
