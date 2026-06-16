"use client";

import { useState, useEffect } from 'react';

import EventModal from '@/components/EventModal';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewMode, setViewMode] = useState('monthly');

  const fetchEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.data);
        }
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [isModalOpen]); 

  const handleEditEvent = (evt: any, e: any) => {
    e.stopPropagation();
    setSelectedEvent(evt);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (id: string, e: any) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this event?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const renderDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDay(); 
    
    const days = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 border border-slate-700 bg-slate-800/30"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = events.filter((e: any) => {
        const eDate = new Date(e.date);
        return eDate.getDate() === i && eDate.getMonth() === currentDate.getMonth();
      });

      days.push(
        <div key={`day-${i}`} className="p-4 border border-slate-700 hover:bg-slate-700 transition-colors min-h-[100px] flex flex-col">
          <span className="font-bold text-slate-300">{i}</span>
          <div className="mt-2 flex-grow space-y-1">
            {dayEvents.map((evt: any, idx) => (
              <div key={idx} className="text-xs bg-indigo-600/80 text-white p-1 rounded group relative cursor-pointer" onClick={(e) => handleEditEvent(evt, e)}>
                <div className="truncate font-bold">{evt.title}</div>
                
                {/* Delete button appears on hover */}
                <button onClick={(e) => handleDeleteEvent(evt._id, e)} className="hidden group-hover:block absolute top-0 right-0 bg-red-600 text-white px-1 rounded hover:bg-red-500">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 w-[110vw] md:w-full relative flex gap-6">
      
      {/* Sidebar for Upcoming Events */}
      <div className="w-64 bg-slate-800 p-4 rounded-lg border border-slate-700 hidden md:block">
        <h3 className="text-xl font-bold mb-4 text-violet-400">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-slate-400">No upcoming events.</p>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map(evt => (
              <div key={evt._id} className="bg-slate-900 p-3 rounded shadow cursor-pointer hover:bg-slate-700" onClick={(e) => handleEditEvent(evt, e)}>
                <p className="font-bold text-indigo-300">{evt.title}</p>
                <p className="text-xs text-slate-400">{new Date(evt.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4 bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700">
          <button onClick={prevMonth} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors">&larr; Prev</button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="mt-2 space-x-2">
              <button onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }} className="px-4 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-sm transition-colors font-bold">
                + Create Event
              </button>
            </div>
            
            {/* View Toggles */}
            <div className="mt-4 flex justify-center space-x-2">
              <button onClick={() => setViewMode('monthly')} className={`px-3 py-1 rounded text-xs ${viewMode === 'monthly' ? 'bg-indigo-600' : 'bg-slate-700'}`}>Monthly</button>
              <button onClick={() => setViewMode('weekly')} className={`px-3 py-1 rounded text-xs ${viewMode === 'weekly' ? 'bg-indigo-600' : 'bg-slate-700'}`}>Weekly</button>
              <button onClick={() => setViewMode('daily')} className={`px-3 py-1 rounded text-xs ${viewMode === 'daily' ? 'bg-indigo-600' : 'bg-slate-700'}`}>Daily</button>
            </div>
          </div>
          
          <button onClick={nextMonth} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors">Next &rarr;</button>
        </div>

        {viewMode === 'monthly' ? (
          <div className="grid grid-cols-7 gap-1 bg-slate-700 p-1 rounded-lg">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold p-2 bg-slate-800 text-slate-400 rounded-sm">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        ) : (
          <div className="bg-slate-800 p-10 text-center rounded-lg border border-slate-700">
            <p className="text-xl text-slate-400 font-bold">The {viewMode} view is currently undergoing maintenance!</p>
          </div>
        )}
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} existingEvent={selectedEvent} />
    </div>
  );
}
