"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  gradient?: "purple" | "blue" | "cyan" | "pink";
  className?: string;
}

const GRADIENTS = {
  purple: ["#a855f7", "#6366f1"],
  blue: ["#3b82f6", "#6366f1"],
  cyan: ["#22d3ee", "#3b82f6"],
  pink: ["#ec4899", "#a855f7"],
};

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  gradient = "purple",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const offset = useTransform(spring, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    spring.set(Math.min(100, Math.max(0, value)));
  }, [value, spring]);

  const [c1, c2] = GRADIENTS[gradient];
  const id = `grad-${label.replace(/\s/g, "")}-${gradient}`;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-slate-200">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-center text-xs text-slate-500">{sublabel}</p>
      )}
    </div>
  );
}
