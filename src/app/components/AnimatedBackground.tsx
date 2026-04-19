import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Observe body for height changes
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    const animate = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floating gradient orbs
      const orbs = [
        { cx: 0.2, cy: 0.15, r: 300, color: "rgba(244,63,94,0.03)", speed: 1 },
        { cx: 0.8, cy: 0.3, r: 250, color: "rgba(168,85,247,0.025)", speed: 1.3 },
        { cx: 0.5, cy: 0.5, r: 350, color: "rgba(212,165,116,0.02)", speed: 0.8 },
        { cx: 0.3, cy: 0.7, r: 280, color: "rgba(244,63,94,0.025)", speed: 1.1 },
        { cx: 0.7, cy: 0.85, r: 320, color: "rgba(168,85,247,0.02)", speed: 0.9 },
      ];

      orbs.forEach((orb) => {
        const x = canvas.width * orb.cx + Math.sin(time * orb.speed) * 80;
        const y = canvas.height * orb.cy + Math.cos(time * orb.speed * 0.7) * 60;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(x - orb.r, y - orb.r, orb.r * 2, orb.r * 2);
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
