import React, { useEffect, useRef } from 'react';

const moodColors = {
  bored: ['#FF6B6B','#FFE66D'], sad: ['#74B9FF','#A29BFE'],
  productive: ['#00B894','#00CEC9'], relaxed: ['#FDCB6E','#E17055'],
  confused: ['#A29BFE','#FD79A8'], anxious: ['#FD79A8','#ff6b6b'], excited: ['#FFD93D','#FF6B6B'],
  default: ['#6c63ff44','#ff6b9d33']
};

export default function ParticlesBg({ mood }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const colors = moodColors[mood] || moodColors.default;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 600 ? 16 : 30;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 5 + 2, speedX: (Math.random() - 0.5) * 0.7, speedY: (Math.random() - 0.5) * 0.7,
      opacity: Math.random() * 0.35 + 0.08, color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += 0.018;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const op = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(op * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('resize', resize); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [mood]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />;
}
