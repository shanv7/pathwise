import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  title: string;
  company: string;
  department: string;
  activeLearners: number;
  totalRuns: number;
  avgScore: number;
}

// Mock clients - corporate coaching clients
const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'Sarah Mitchell',
    title: 'VP of Engineering',
    company: 'TechFlow Solutions',
    department: 'Engineering',
    activeLearners: 8,
    totalRuns: 42,
    avgScore: 72
  },
  {
    id: 'client-002',
    name: 'Michael Chen',
    title: 'Director of Product',
    company: 'Innovate Labs',
    department: 'Product',
    activeLearners: 5,
    totalRuns: 28,
    avgScore: 68
  },
  {
    id: 'client-003',
    name: 'Jennifer Brooks',
    title: 'Chief People Officer',
    company: 'Global Dynamics',
    department: 'Human Resources',
    activeLearners: 12,
    totalRuns: 64,
    avgScore: 78
  },
  {
    id: 'client-004',
    name: 'David Park',
    title: 'SVP of Operations',
    company: 'Nexus Corp',
    department: 'Operations',
    activeLearners: 6,
    totalRuns: 35,
    avgScore: 71
  }
];

export default function CoachHome() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    clients: mockClients.length,
    totalRuns: mockClients.reduce((sum, c) => sum + c.totalRuns, 0),
    avgScore: Math.round(mockClients.reduce((sum, c) => sum + c.avgScore, 0) / mockClients.length),
    activeLearners: mockClients.reduce((sum, c) => sum + c.activeLearners, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
      {/* Playful Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EE6C4D] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D5A80] rounded-full opacity-5 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="relative bg-[#3D5A80] border-b-2 border-[#293241] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/pathwiseicon_square.png" 
                alt="Pathwise" 
                className="w-16 h-16 rounded-2xl shadow-lg"
              />
              <div>
                <img 
                  src="/pathwise_wordmark_white.png" 
                  alt="Pathwise" 
                  className="h-10 mb-2"
                />
                <p className="text-[#E0FBFC] font-medium">Manage your coaching clients ✨</p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-3">
              {/* History Button */}
              <button
                onClick={() => window.location.href = '/history'}
                className="flex items-center space-x-2 px-4 py-2 bg-[#EE6C4D] hover:bg-[#D85A3A] text-white rounded-lg font-medium transition-colors shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Practice History</span>
              </button>

              <div className="flex items-center space-x-2 bg-[#293241] rounded-xl p-1 border-2 border-[#98C1D9]">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-[#E0FBFC] hover:bg-[#3D5A80] rounded-lg font-bold transition-colors"
                >
                  🎓 Learner
                </button>
                <button
                  className="px-4 py-2 bg-[#98C1D9] text-[#293241] rounded-lg font-bold shadow-md"
                >
                  👨‍🏫 Coach
                </button>
              </div>
            </div>
          </div>

          {/* Fun Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Clients', value: totalStats.clients, emoji: '👥', color: 'from-[#3D5A80] to-[#98C1D9]' },
              { label: 'Total Runs', value: totalStats.totalRuns, emoji: '⚡', color: 'from-[#98C1D9] to-[#E0FBFC]' },
              { label: 'Avg Score', value: `${totalStats.avgScore}%`, emoji: '🎯', color: 'from-[#EE6C4D] to-[#ff8a73]' },
              { label: 'Active Learners', value: totalStats.activeLearners, emoji: '📚', color: 'from-[#98C1D9] to-[#3D5A80]' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 border-2 border-transparent hover:border-[#98C1D9] cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#3D5A80] uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-black text-[#293241] mt-1">{stat.value}</p>
                  </div>
                  <div className="text-5xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform">
                    {stat.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg border-3 border-[#98C1D9] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all shadow-lg bg-white"
            />
            <svg className="w-6 h-6 text-[#3D5A80] absolute left-5 top-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client, idx) => (
            <div
              key={client.id}
              onClick={() => window.location.href = `/coach/client/${client.id}`}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-[#E0FBFC] hover:border-[#98C1D9] overflow-hidden transform hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col">
                {/* Top: Client Avatar & Info */}
                <div className="bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] p-8 flex items-center space-x-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>
                  
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#EE6C4D] to-[#ff8a73] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-white">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white">{client.name}</h3>
                    <p className="text-[#E0FBFC] font-medium">{client.title}</p>
                    <p className="text-sm text-[#E0FBFC] opacity-80">{client.company} • {client.department}</p>
                  </div>

                  <svg className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Bottom: Stats */}
                <div className="p-6 bg-gradient-to-br from-white to-[#E0FBFC]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-black text-[#293241]">{client.activeLearners}</p>
                        <p className="text-xs font-bold text-[#3D5A80] uppercase">Learners</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-[#293241]">{client.totalRuns}</p>
                        <p className="text-xs font-bold text-[#3D5A80] uppercase">Runs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-[#293241]">{client.avgScore}%</p>
                        <p className="text-xs font-bold text-[#3D5A80] uppercase">Avg Score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-4 py-2 bg-[#3D5A80] text-white rounded-full text-sm font-bold">
                        3 Scenarios
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4 animate-bounce">🤔</div>
            <p className="text-2xl font-black text-[#293241] mb-2">No clients found</p>
            <p className="text-[#3D5A80]">Try adjusting your search!</p>
          </div>
        )}
      </div>
    </div>
  );
}

