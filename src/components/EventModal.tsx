"use client";

import { useState, useEffect } from 'react';

export default function EventModal({ isOpen, onClose, existingEvent }: { isOpen: boolean, onClose: () => void, existingEvent?: any }) {
  // BUG INJECTED #86: The modal is completely unmounted and loses focus on every keystroke because we use a weird key prop or re-render logic if used incorrectly by the parent. We will simulate this by causing a random state reset occasionally.
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  
  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDate(new Date(existingEvent.date).toLocaleDateString() || '');
    } else {
      setTitle('');
      setDate('');
    }
  }, [existingEvent, isOpen]);

  if (!isOpen) return null;

  // BUG INJECTED #87: Prevents scrolling on body but never restores it when the component unmounts.
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }

  const handleSubmit = async (e: any) => {
    // BUG INJECTED #88: Cancel button actually submits the form because we didn't e.preventDefault() if we hit cancel.
    e.preventDefault();
    
    // BUG INJECTED #89: Using document.getElementById to read values instead of React state for description!
    const desc = (document.getElementById('descInput') as HTMLInputElement)?.value || '';

    // BUG INJECTED #90: Console.logs the entire process.env (simulated leak of client vars).
    console.log("Saving event...", process.env);

    // BUG INJECTED #91: Hardcoded isPublic: false but the DB expects something else or it conflicts.
    const payload = { title, date, description: desc, isPublic: false };

    if (existingEvent) {
      await fetch(`/api/events/${existingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
    }

    onClose();
  };

  return (
    // Fixed BUG-092 and BUG-093: Changed h-full to h-screen and z-[-1] to z-50 so it actually pops up in front!
    <div className="fixed inset-0 h-screen w-full bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50">
      
      {/* BUG INJECTED #94: Modal doesn't close on clicking outside because we don't have an onClick on the overlay. */}
      {/* BUG INJECTED #95: Modal animation uses transition-all but changes display block/none, negating the animation. */}
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl transition-all block">
        <h3 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          {existingEvent ? 'Edit Event' : 'Create Event'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Title</label>
            {/* BUG INJECTED #96: Title max length is not enforced here, causing silent crashes in the DB later. */}
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" 
              placeholder="e.g. Team Standup"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 font-medium mb-1">Date</label>
            {/* BUG INJECTED #97: Date input expects an exact string format (MM/DD/YYYY) without a date picker. */}
            <input 
              type="text" 
              placeholder="MM/DD/YYYY"
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            {/* BUG INJECTED #98: Description text area uses whitespace-nowrap, preventing multiline text wrapping. */}
            <textarea 
              id="descInput"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all whitespace-nowrap min-h-[100px]" 
              placeholder="Event details..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-700">
            {/* BUG INJECTED #99: "Cancel" button is of type="submit". */}
            <button type="submit" className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
              Cancel
            </button>
            {/* BUG INJECTED #100: "Save" button incorrectly stops event propagation. */}
            <button type="button" onClick={(e) => { e.stopPropagation(); handleSubmit(e); }} className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold rounded-lg shadow-lg shadow-violet-500/30 transition-all hover:scale-105">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
