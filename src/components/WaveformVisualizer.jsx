import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * WaveformVisualizer - Modern Sine Wave Animation
 * Replaces old bars with a fluid, organic wave visualization using Canvas API.
 */
const WaveformVisualizer = ({
    isActive = false,
    audioLevel = 50,
    height = 100,
    color = '#22C55E' // Neon Green
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const phaseRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width;

        // Handle resize
        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = height;
                width = canvas.width;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size

        const render = () => {
            if (!ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Configuration for wave
            const centerY = height / 2;
            // Amplitude depends on audioLevel if active, else minimal
            const baseAmplitude = isActive ? (audioLevel / 100) * (height / 2.5) : 3;
            const frequency = 0.01;
            const speed = isActive ? 0.15 : 0.05;

            phaseRef.current += speed;

            // Draw primary wave
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;

            for (let x = 0; x < width; x++) {
                // Combine multiple sine waves for organic look
                const y = centerY +
                    Math.sin(x * frequency + phaseRef.current) * baseAmplitude * Math.sin(phaseRef.current * 0.5) +
                    Math.sin(x * frequency * 2 + phaseRef.current * 1.5) * (baseAmplitude / 2);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw secondary subtle wave (ghost wave)
            if (isActive) {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = `${color}40`; // 25% opacity
                ctx.shadowBlur = 0;

                for (let x = 0; x < width; x++) {
                    const y = centerY +
                        Math.sin(x * (frequency * 1.2) - phaseRef.current * 0.8) * (baseAmplitude * 0.8);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, audioLevel, height, color]);

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
            <canvas
                ref={canvasRef}
                className="w-full block"
                style={{ height: `${height}px` }}
            />

            {/* Fallback/Overlay glow text or effect could go here */}
            {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-white/5" />
                </div>
            )}
        </div>
    );
};

WaveformVisualizer.propTypes = {
    isActive: PropTypes.bool,
    audioLevel: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default WaveformVisualizer;
