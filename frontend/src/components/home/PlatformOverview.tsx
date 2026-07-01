"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  FileText, 
  Bot, 
  TrendingUp, 
  Network, 
  Link2, 
  ShieldCheck, 
  Activity, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    title: "Analytics",
    description: "Deep dive into your business data with interactive, real-time analytics.",
    benefits: ["Real-time dashboards", "Custom queries", "Interactive filtering"],
    icon: BarChart3,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    title: "Reporting",
    description: "Automate complex reports and distribute them to stakeholders effortlessly.",
    benefits: ["Scheduled delivery", "PDF/Excel export", "Pixel-perfect layouts"],
    icon: FileText,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    title: "AI Copilot",
    description: "Your intelligent assistant for querying data using natural language.",
    benefits: ["Natural language queries", "Contextual help", "Automated insights"],
    icon: Bot,
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    title: "Predictions",
    description: "Forecast future trends and anomalies using state-of-the-art machine learning.",
    benefits: ["Revenue forecasting", "Churn prediction", "Demand planning"],
    icon: TrendingUp,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "Workflow Automation",
    description: "Trigger automated actions based on specific data conditions or thresholds.",
    benefits: ["Visual builder", "Multi-step logic", "Third-party actions"],
    icon: Network,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "Integrations",
    description: "Connect all your data sources and tools with our unified data layer.",
    benefits: ["50+ connectors", "Real-time sync", "API access"],
    icon: Link2,
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    title: "Governance",
    description: "Maintain strict control over data access with enterprise-grade security.",
    benefits: ["Role-based access", "Audit logs", "Data masking"],
    icon: ShieldCheck,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    title: "Operations Center",
    description: "Monitor the health and performance of your data pipelines and infrastructure.",
    benefits: ["System health", "Cost tracking", "Alerting"],
    icon: Activity,
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    title: "AI Insights",
    description: "Proactive recommendations and insights generated automatically from your data.",
    benefits: ["Anomaly detection", "Root cause analysis", "Growth opportunities"],
    icon: Sparkles,
    color: "text-pink-500 bg-pink-500/10",
  },
];

export function PlatformOverview() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-black relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Everything Your Business Needs In One Platform
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            A comprehensive suite of tools designed to transform how your enterprise interacts with data, builds predictions, and automates workflows.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Premium hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-500 pointer-events-none" />
              
              <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500/50" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
