import { useParams } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  title: string;
  company: string;
  department: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  characterName: string;
  characterRole: string;
  estimatedTime: string;
  timesRun: number;
  avgScore: number;
}

// Mock clients
const mockClients: Record<string, Client> = {
  'client-001': {
    id: 'client-001',
    name: 'Sarah Mitchell',
    title: 'VP of Engineering',
    company: 'TechFlow Solutions',
    department: 'Engineering'
  },
  'client-002': {
    id: 'client-002',
    name: 'Michael Chen',
    title: 'Director of Product',
    company: 'Innovate Labs',
    department: 'Product'
  },
  'client-003': {
    id: 'client-003',
    name: 'Jennifer Brooks',
    title: 'Chief People Officer',
    company: 'Global Dynamics',
    department: 'Human Resources'
  },
  'client-004': {
    id: 'client-004',
    name: 'David Park',
    title: 'SVP of Operations',
    company: 'Nexus Corp',
    department: 'Operations'
  }
};

// The 3 scenarios - matching learner area titles
const scenarios: Scenario[] = [
  {
    id: 'def-dev-001',
    name: 'Delivering Difficult Feedback',
    description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
    characterName: 'Alex Chen',
    characterRole: 'Software Engineer II',
    estimatedTime: '15-20 min',
    timesRun: 42,
    avgScore: 58
  },
  {
    id: 'check-sen-001',
    name: 'Re-engaging a Disengaged Employee',
    description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
    characterName: 'Jordan Martinez',
    characterRole: 'Senior Customer Success Manager',
    estimatedTime: '20-25 min',
    timesRun: 28,
    avgScore: 65
  },
  {
    id: 'hp-bias-001',
    name: 'Navigating a Bias Complaint',
    description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
    characterName: 'Priya Sharma',
    characterRole: 'Senior ML Engineer',
    estimatedTime: '25-30 min',
    timesRun: 18,
    avgScore: 72
  }
];

export default function ClientScenarios() {
  const { clientId } = useParams<{ clientId: string }>();
  const client = clientId ? mockClients[clientId] : null;

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#293241]">Client not found</p>
          <button
            onClick={() => window.location.href = '/coach'}
            className="mt-4 px-6 py-3 bg-[#EE6C4D] text-white rounded-xl font-bold"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
      {/* Background Decorations */}
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
                <p className="text-[#E0FBFC] font-medium">Client Scenarios ✨</p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-3">
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

          {/* Client Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center space-x-6">
            <button
              onClick={() => window.location.href = '/coach'}
              className="p-3 bg-[#E0FBFC] hover:bg-[#98C1D9] rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-[#3D5A80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-[#EE6C4D] to-[#ff8a73] rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-black text-[#293241]">{client.name}</h2>
              <p className="text-[#3D5A80] font-medium">{client.title}</p>
              <p className="text-sm text-[#98C1D9]">{client.company} • {client.department}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-[#293241]">3</p>
              <p className="text-sm font-bold text-[#3D5A80] uppercase">Scenarios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 gap-6">
          {scenarios.map((scenario, idx) => (
            <div
              key={scenario.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-[#E0FBFC] hover:border-[#98C1D9] overflow-hidden transform hover:-translate-y-2"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left: Character Avatar & Info */}
                <div className="md:w-1/4 bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>
                  
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#EE6C4D] to-[#ff8a73] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-white">
                    {scenario.characterName.charAt(0)}
                  </div>
                  
                  <h3 className="mt-4 text-xl font-black text-white text-center">{scenario.characterName}</h3>
                  <p className="text-sm text-[#E0FBFC] text-center">{scenario.characterRole}</p>
                </div>

                {/* Middle: Scenario Details */}
                <div className="flex-1 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-[#293241] mb-2 group-hover:text-[#3D5A80] transition-colors">
                        {scenario.name}
                      </h3>
                      <p className="text-[#3D5A80] leading-relaxed">{scenario.description}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📊</span>
                      <span className="text-[#3D5A80] font-semibold">{scenario.timesRun} runs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎯</span>
                      <span className="text-[#3D5A80] font-semibold">{scenario.avgScore}% avg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">⏱️</span>
                      <span className="text-[#3D5A80] font-semibold">{scenario.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="md:w-64 bg-gradient-to-br from-[#E0FBFC] to-white p-6 border-l-2 border-[#98C1D9] flex flex-col space-y-3">
                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/configure`}
                    className="w-full py-3 px-4 bg-white hover:bg-[#E0FBFC] text-[#3D5A80] border-2 border-[#3D5A80] rounded-xl font-bold transition-all transform hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configure</span>
                  </button>

                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/test`}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#EE6C4D] to-[#ff8a73] hover:from-[#ff8a73] hover:to-[#EE6C4D] text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Test Run</span>
                  </button>

                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/analytics`}
                    className="w-full py-3 px-4 bg-white hover:bg-[#98C1D9] text-[#3D5A80] hover:text-white border-2 border-[#98C1D9] rounded-xl font-bold transition-all transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analytics</span>
                  </button>

                  <div className="pt-3 mt-3 border-t-2 border-[#98C1D9]">
                    <p className="text-xs font-bold text-[#3D5A80] mb-2 uppercase tracking-wide">Quick Actions</p>
                    <div className="space-y-1">
                      <button className="w-full text-xs py-2 text-[#3D5A80] hover:text-[#EE6C4D] hover:bg-white rounded-lg transition-all text-left px-2 font-semibold">
                        📋 Duplicate
                      </button>
                      <button className="w-full text-xs py-2 text-[#3D5A80] hover:text-[#EE6C4D] hover:bg-white rounded-lg transition-all text-left px-2 font-semibold">
                        📤 Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

