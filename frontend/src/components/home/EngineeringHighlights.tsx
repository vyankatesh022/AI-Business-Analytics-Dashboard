"use client";

import { motion } from "framer-motion";
import { Code2, GitBranch, Layers, Container, FileCode2, ShieldAlert } from "lucide-react";

const engineeringPractices = [
  {
    title: "Clean Architecture",
    description: "Strict separation of concerns using Domain-Driven Design principles.",
    icon: Layers,
  },
  {
    title: "Repository & Service Layers",
    description: "Abstracted data access and business logic for testability and scaling.",
    icon: Code2,
  },
  {
    title: "Multi-Tenant SaaS",
    description: "Robust Row-Level Security (RLS) and logical isolation per tenant.",
    icon: ShieldAlert,
  },
  {
    title: "Kubernetes & CI/CD",
    description: "Fully containerized deployments with automated GitHub Actions pipelines.",
    icon: Container,
  },
  {
    title: "Infrastructure as Code",
    description: "Provisioned and managed entirely via Terraform for repeatable environments.",
    icon: FileCode2,
  },
  {
    title: "GitOps Workflows",
    description: "Automated PR previews, comprehensive linting, and automated testing.",
    icon: GitBranch,
  },
];

export function EngineeringHighlights() {
  return (
    <section className="py-24 bg-black text-white relative border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium mb-6"
            >
              <Code2 className="h-4 w-4" />
              <span>Engineering Excellence</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
            >
              Built For Production, From Day One.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-zinc-400 mb-8"
            >
              This isn&apos;t a prototype. It&apos;s a production-ready system utilizing advanced software engineering patterns, designed to pass the most rigorous technical due diligence.
            </motion.p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {engineeringPractices.map((practice, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <practice.icon className="h-6 w-6 text-zinc-500 mb-3" />
                <h3 className="font-bold text-zinc-100 mb-1">{practice.title}</h3>
                <p className="text-xs text-zinc-500">{practice.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
