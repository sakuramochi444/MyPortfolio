"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  animation?: "reveal-up" | "reveal-left" | "reveal-right";
  className?: string;
}

export default function Reveal({ children, animation = "reveal-up", className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 既に画面内にある場合は即座に表示
    const checkInitialVisibility = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setIsVisible(true);
          return true;
        }
      }
      return false;
    };

    if (checkInitialVisibility()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 } // 少しでも見えたら発火
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${animation} ${isVisible ? "active" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
