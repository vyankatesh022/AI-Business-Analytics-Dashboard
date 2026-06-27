'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Calculator, Target, BarChart2, Briefcase, Zap, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Command Menu */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
          >
            <Command 
              className="w-full flex flex-col bg-white overflow-hidden text-slate-800"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
              }}
            >
              <div className="flex items-center border-b border-slate-100 px-4">
                <Search className="w-5 h-5 text-slate-400 mr-2" />
                <Command.Input 
                  autoFocus
                  placeholder="Type a command or search..." 
                  className="w-full bg-transparent outline-none py-4 text-sm placeholder:text-slate-400"
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-6 text-center text-sm text-slate-500">
                  No results found.
                </Command.Empty>

                <Command.Group heading={<div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pages</div>}>
                  <Command.Item 
                    onSelect={() => { router.push('/predictions'); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition"
                  >
                    <Target className="w-4 h-4" /> Predictions Center
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => { router.push('/analytics'); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition"
                  >
                    <BarChart2 className="w-4 h-4" /> Analytics Dashboard
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => { router.push('/workspace'); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition"
                  >
                    <Briefcase className="w-4 h-4" /> Data Workspace
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={<div className="px-2 py-1.5 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</div>}>
                  <Command.Item 
                    onSelect={() => { console.log("Run Prediction"); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition"
                  >
                    <Zap className="w-4 h-4" /> Run New Prediction
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => { console.log("Deploy Model"); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition"
                  >
                    <Calculator className="w-4 h-4" /> Deploy ML Model
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={<div className="px-2 py-1.5 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</div>}>
                  <Command.Item 
                    onSelect={() => { setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-slate-100 aria-selected:bg-slate-100 transition"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => { setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer hover:bg-rose-50 hover:text-rose-600 aria-selected:bg-rose-50 aria-selected:text-rose-600 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
