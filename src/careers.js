import React from 'react';
import { Briefcase, Zap, Globe, ArrowRight, ShieldCheck, Map, Search } from 'lucide-react';

export default function CareerPage({ theme, themeMode }) {
  // Mock data for career paths
  const paths = [
    {
      id: 1,
      title: "Remote Software Developer",
      type: "Remote / Tech",
      match: "98%",
      skills: ["JavaScript", "Problem Solving"],
      icon: <Zap className="text-yellow-500" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Accessibility Consultant",
      type: "Consulting",
      match: "92%",
      skills: ["WCAG", "User Advocacy"],
      icon: <ShieldCheck className="text-green-500" />,
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "Content Strategist",
      type: "Creative",
      match: "85%",
      skills: ["Writing", "SEO"],
      icon: <Globe className="text-purple-500" />,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className={`py-12 px-6 max-w-7xl mx-auto`}>
      {/* Header Section */}
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-4xl lg:text-5xl font-black mb-4">
          Tailored <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00] to-white' : 'from-indigo-600 to-purple-600'}`}>Career Maps</span>
        </h2>
        <p className={`${theme.textSecondary} text-lg max-w-2xl`}>
          Based on your profile, we have identified sectors where your specific skills shine. These paths focus on accessibility and growth.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className={`mb-10 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center ${theme.glass}`}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
          <input 
            type="text" 
            placeholder="Search by skill or industry..." 
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all ${theme.input}`}
          />
        </div>
        <button className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${theme.primaryBtn}`}>
          <Map size={18} />
          Generate New Path
        </button>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paths.map((path) => (
          <div key={path.id} className={`group p-8 rounded-[2rem] flex flex-col h-full ${theme.card}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-lg text-2xl`}>
                {path.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-100 text-indigo-700'}`}>
                {path.match} Match
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-500 transition-colors">
              {path.title}
            </h3>
            <p className={`text-sm font-semibold mb-6 opacity-60`}>
              {path.type}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {path.skills.map((skill, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-lg border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 dark:border-slate-700'}`}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-2 font-bold text-sm group/btn">
                Explore this path 
                <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}