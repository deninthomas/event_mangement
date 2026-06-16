import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Master Your Time with <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
          Event Calendar System
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
        Experience a premium, seamlessly integrated platform designed to track and manage your upcoming events, appointments, and important dates with absolute precision.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 hover:-translate-y-1 text-lg">
          Get Started Now
        </Link>
        <Link href="/login" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:scale-105 text-lg">
          Sign In
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: 'Effortless Scheduling', desc: 'Create and manage events with an intuitive, fluid interface.' },
          { title: 'Premium Aesthetics', desc: 'Enjoy a gorgeous glassmorphic dark mode that reduces eye strain.' },
          { title: 'Seamless Organization', desc: 'Keep track of daily, weekly, and monthly goals effortlessly.' }
        ].map((feature, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl text-left border border-slate-700/50 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-md shadow-inner" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
