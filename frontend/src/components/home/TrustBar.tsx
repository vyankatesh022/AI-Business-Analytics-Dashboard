"use client";

import { motion } from "framer-motion";

const technologies = [
  { name: "Next.js", color: "text-black dark:text-white" },
  { name: "React", color: "text-blue-500" },
  { name: "TypeScript", color: "text-blue-600" },
  { name: "FastAPI", color: "text-teal-500" },
  { name: "PostgreSQL", color: "text-indigo-500" },
  { name: "AWS", color: "text-amber-500" },
  { name: "Docker", color: "text-sky-500" },
  { name: "Kubernetes", color: "text-blue-600" },
  { name: "Terraform", color: "text-purple-500" },
];

export function TrustBar() {
  return (
    <section className="py-12 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Built Using Enterprise Technologies
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Left/Right Gradients for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-black to-transparent z-10 pointer-events-none" />

        {/* Marquee effect */}
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          className="flex gap-16 items-center whitespace-nowrap py-2"
        >
          {/* We duplicate the array to make the infinite loop smooth */}
          {[...technologies, ...technologies, ...technologies].map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-700 dark:text-zinc-300 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className={`w-2.5 h-2.5 rounded-full bg-current ${tech.color}`} />
              <span>{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
