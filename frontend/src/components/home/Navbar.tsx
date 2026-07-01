"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <span className="text-lg leading-none">E</span>
          </div>
          <span className="hidden sm:inline-block text-zinc-900 dark:text-white">Enterprise AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</Link>
          <Link href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Architecture</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Customers</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Button render={<Link href="/auth/register" />} nativeButton={false} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5">
            Get Started
          </Button>
        </div>

      </div>
    </motion.header>
  );
}
