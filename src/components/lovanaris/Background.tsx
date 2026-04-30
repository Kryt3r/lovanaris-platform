"use client";

import { motion } from "framer-motion";

export function LovanarisBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ backgroundColor: "var(--lovanaris-bg)" }}>
      {/* Subtle Indigo Blob - Smaller and further reduced complexity */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          x: ["-2%", "2%", "-2%"],
          y: ["-1%", "1%", "-1%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[60px]"
        style={{ 
          background: "rgba(30, 58, 138, 0.1)",
          willChange: "transform",
          transform: "translateZ(0)"
        }}
      />

      {/* Subtle Teal Blob - Smaller */}
      <motion.div
        animate={{
          scale: [1.05, 1, 1.05],
          x: ["2%", "-2%", "2%"],
          y: ["1%", "-1%", "1%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[60px]"
        style={{ 
          background: "rgba(20, 184, 166, 0.05)",
          willChange: "transform",
          transform: "translateZ(0)"
        }}
      />

      {/* Central Light Source - Static */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vh] blur-[80px] opacity-10"
        style={{ 
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
          transform: "translateZ(0)"
        }}
      />
      
      {/* 
        NOISE ENTFERNT: SVG-Filter sind extrem rechenintensiv beim Scrollen.
        Für eine perfekte Performance nutzen wir hier nur noch die Blobs.
      */}
    </div>
  );
}
