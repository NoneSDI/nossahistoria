import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: "heart" | "sparkle" | "dot";
  rotation: number;
  rotationSpeed: number;
  pulse: number;
  pulseSpeed: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const count = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      const types: Particle["type"][] = ["heart", "sparkle", "dot"];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.25 + 0.05,
        type: types[Math.floor(Math.random() * 3)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        pulse: 0,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.beginPath();
      const s = size / 2;
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y - s * 0.5, x - s, y - s * 0.5, x - s, y + s * 0.1);
      ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
      ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
      ctx.bezierCurveTo(x + s, y - s * 0.5, x, y - s * 0.5, x, y + s * 0.3);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const pulseFactor = 1 + Math.sin(p.pulse) * 0.2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity * (0.8 + Math.sin(p.pulse) * 0.2);

        if (p.type === "heart") {
          ctx.fillStyle = "#c4798a";
          drawHeart(0, 0, p.size * pulseFactor);
        } else if (p.type === "sparkle") {
          ctx.strokeStyle = "#d4a574";
          ctx.lineWidth = 0.8;
          const s = p.size * pulseFactor;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
          }
          ctx.stroke();
        } else {
          ctx.fillStyle = "#a78bfa";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4 * pulseFactor, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
