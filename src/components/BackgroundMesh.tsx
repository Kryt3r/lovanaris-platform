"use client";

import { motion } from "framer-motion";

export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Primary Red Glow - Moving */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: ["-5%", "5%", "-5%"],
          y: ["-5%", "5%", "-5%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-0 left-0 w-[80vw] h-[80vw] rounded-full bg-red-900/10 blur-[80px]"
      />

      {/* Left-side ambient — covers navbar area */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-[20vw] h-[60vh] rounded-full blur-[60px]"
        style={{ background: "rgba(255,0,51,0.04)" }}
      />
      
      {/* Secondary Bottom Glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: ["5%", "-5%", "5%"],
          y: ["5%", "-5%", "5%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-zinc-900/40 blur-[60px]"
      />

      {/* Central Flare - Extrem optimiert für Performance */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] bg-red-600/5 blur-[60px] opacity-15" 
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Noise Overlay entfernt (für reines Schwarz) */}

      {/* Grid entfernt */}
    </div>
  );
}
