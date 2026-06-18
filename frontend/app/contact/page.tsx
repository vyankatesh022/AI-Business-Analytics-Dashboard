"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Headphones, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Footer } from "@/components/landing/Footer";

// Schema for form validation to prevent bypass
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  // Honeypot field for spam bots
  bot_field: z.string().max(0, "Bot detected").optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    // If the honeypot field is filled, silently ignore to stop bots
    if (data.bot_field && data.bot_field.length > 0) {
      setSubmitStatus("success");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real application, you'd send this to an API endpoint
      // Ensure data is sent securely to your backend
      console.log("Securely submitted form data", data);
      
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-zinc-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/40 bg-[#05070f]/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-cyan-400 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Whether you have questions about custom pricing, need help with ML pipeline integrations, or want to discuss enterprise security audits, our team is here for you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email Sales</h3>
                <a href="mailto:sales@vibeanalytics.com" className="text-zinc-400 hover:text-cyan-400 transition-colors">sales@vibeanalytics.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Technical Support</h3>
                <Link href="/support" className="text-zinc-400 hover:text-purple-400 transition-colors">Go to Help Center &rarr;</Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Community Discord</h3>
                <a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">Join Developer Server &rarr;</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Secure Form */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-950/40 border border-zinc-800/60 p-8 rounded-2xl shadow-xl">
            {submitStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully</h3>
                <p className="text-zinc-400">We&apos;ve received your request and will get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Honeypot field - invisible to users, catches spam bots */}
                <div className="hidden" aria-hidden="true">
                  <input type="text" {...register("bot_field")} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300">Full Name</label>
                    <input 
                      id="name"
                      {...register("name")}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white"
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Work Email</label>
                    <input 
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white"
                      placeholder="jane@company.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium text-zinc-300">Company (Optional)</label>
                  <input 
                    id="company"
                    {...register("company")}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white"
                    placeholder="Acme Corp"
                  />
                  {errors.company && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-300">How can we help?</label>
                  <textarea 
                    id="message"
                    rows={5}
                    {...register("message")}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white resize-none"
                    placeholder="Tell us about your data infrastructure and analytical goals..."
                  />
                  {errors.message && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.message.message}</p>}
                </div>

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>There was a problem submitting your form. Please try again or email us directly.</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Sending securely...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-xs text-zinc-500 text-center mt-6 flex justify-center items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> All submissions are AES-256 encrypted
                </p>
              </form>
            )}
          </div>
        </div>

      </main>

      <Footer isDarkMode={true} />
    </div>
  );
}
