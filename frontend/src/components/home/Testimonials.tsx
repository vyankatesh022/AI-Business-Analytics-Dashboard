"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This platform replaced four different fragmented tools in our data stack. The AI copilot alone saves our analysts hundreds of hours a month.",
    author: "Sarah Jenkins",
    role: "Chief Technology Officer",
    company: "Acme Financial",
  },
  {
    quote: "The ability to go from a predictive anomaly straight into an automated workflow without writing a single line of glue code is game-changing.",
    author: "David Chen",
    role: "VP of Data Engineering",
    company: "Global Logistics Inc.",
  },
  {
    quote: "Finally, a platform that gives engineering the governance and observability we need, while giving the business the speed they want.",
    author: "Marcus Thorne",
    role: "Director of Operations",
    company: "RetailEdge",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-black relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl relative shadow-sm"
            >
              <Quote className="absolute top-6 right-6 h-12 w-12 text-zinc-100 dark:text-zinc-800" />
              <p className="text-zinc-700 dark:text-zinc-300 relative z-10 font-medium leading-relaxed mb-8">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{t.author}</h4>
                  <p className="text-xs text-zinc-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
