'use client';

import React, { useEffect, useRef } from 'react';

interface BackgroundDotsProps {
  dotColor?: string;
  backgroundColor?: string;
  dotSize?: number;
  gap?: number;
  fade?: boolean;
}

const BackgroundDots: React.FC<BackgroundDotsProps> = ({
  dotColor = '#6366F1',
  backgroundColor = 'transparent',
  dotSize = 1,
  gap = 20,
  fade = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const columns = Math.ceil(canvas.width / gap);
      const rows = Math.ceil(canvas.height / gap);

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          const distance = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2)
          );

          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2)
          );

          let opacity = 1;
          if (fade) {
            opacity = 1 - distance / maxDistance;
          }

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `${dotColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      }

      time += 0.01;
      animationFrameId = requestAnimationFrame(drawDots);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawDots();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, backgroundColor, dotSize, gap, fade]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default BackgroundDots; 