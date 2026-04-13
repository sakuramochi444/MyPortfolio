"use client";

import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      const isLeft = Math.random() > 0.5;
      particle.style.left = isLeft ? `${Math.random() * 15}%` : `${85 + Math.random() * 15}%`;
      particle.style.top = "-10px";
      
      document.body.appendChild(particle);

      const animation = particle.animate([
        { transform: "translateY(0)", opacity: 0.2 },
        { transform: `translateY(${window.innerHeight}px)`, opacity: 0 }
      ], {
        duration: Math.random() * 5000 + 5000,
        easing: "linear"
      });

      animation.onfinish = () => particle.remove();
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return null;
}
