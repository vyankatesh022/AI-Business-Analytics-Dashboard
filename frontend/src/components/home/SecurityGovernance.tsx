"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileCheck, Users, Database, Key, CheckCircle } from "lucide-react";

const securityFeatures = [
  {
    title: "Role-Based Access Control (RBAC)",
    description: "Granular permissions allowing you to define custom roles for data engineers, analysts, and executives.",
    icon: Users,
  },
  {
    title: "Immutable Audit Logs",
    description: "Comprehensive logging of every query, export, login, and configuration change for compliance tracking.",
    icon: FileCheck,
  },
  {
    title: "Data Governance & Lineage",
    description: "End-to-end data lineage tracking and PII masking to ensure sensitive data stays compliant.",
    icon: Shield,
  },
  {
    title: "Multi-Tenant Isolation",
    description: "Strict tenant isolation at the database and memory layer to prevent cross-tenant data bleed.",
    icon: Database,
  },
  {
    title: "SOC 2 & HIPAA Compliant",
    description: "Pre-configured compliance controls built to meet rigorous enterprise and healthcare regulatory standards.",
    icon: CheckCircle,
  },
  {
    title: "AES-256 & TLS 1.3 Encryption",
    description: "Data is encrypted at rest using AES-256 and in transit using TLS 1.3 with automated key rotation.",
    icon: Key,
  },
];

const badges = [
  "SOC 2 Type II Certified",
  "ISO 27001 Certified",
  "GDPR Compliant",
  "HIPAA Ready",
  "CCPA Compliant",
  "End-to-End Encryption",
];

export function SecurityGovernance() {
  return (
    <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
          >
            <Lock className="h-4 w-4" />
            <span>Bank-Grade Security</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Enterprise Security Built In
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400"
          >
            Security is not an add-on. We built our architecture from day one to protect your most critical corporate data with zero compromises.
          </motion.p>
        </div>

        {/* Security Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Badges Marquee */}
        <div className="pt-8 border-t border-zinc-800 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {badges.map((badge, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-zinc-300 shadow-sm"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
