"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "99.99%", label: "Uptime SLA Guaranteed" },
  { value: "500M+", label: "Events Processed Daily" },
  { value: "50,000+", label: "Reports Generated" },
  { value: "<50ms", label: "Average Query Latency" },
  { value: "100%", label: "Enterprise Security Compliant" },
];

export function MetricsSection() {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                {m.value}
              </div>
              <div className="text-sm font-medium text-blue-100">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
