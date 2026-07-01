"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-32 bg-white dark:bg-black relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px] -ml-40" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Turn Data Into Decisions
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Join the most data-driven enterprises. Unify your analytics, AI, and workflow automation into a single secure platform today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button render={<Link href="/auth/register" />} nativeButton={false} size="lg" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-xl shadow-blue-500/20">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
              <Play className="mr-2 h-5 w-5" /> Request Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            No credit card required. 14-day free trial on all Enterprise plans.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
