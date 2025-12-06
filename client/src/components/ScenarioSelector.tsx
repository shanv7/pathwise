interface Scenario {
  id: string;
  name: string;
  description: string;
  characterName: string;
  characterRole: string;
  estimatedTime: string;
}

interface ScenarioSelectorProps {
  onSelectScenario: (scenarioId: string) => void;
  onBack?: () => void;
}

// Mock scenarios - these would come from API
const mockScenarios: Scenario[] = [
  {
    id: 'def-dev-001',
    name: 'Delivering Difficult Feedback',
    description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
    characterName: 'Alex Chen',
    characterRole: 'Software Engineer II',
    estimatedTime: '15-20 min'
  },
  {
    id: 'check-sen-001',
    name: 'Re-engaging a Disengaged Employee',
    description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
    characterName: 'Jordan Martinez',
    characterRole: 'Senior Customer Success Manager',
    estimatedTime: '20-25 min'
  },
  {
    id: 'hp-bias-001',
    name: 'Navigating a Bias Complaint',
    description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
    characterName: 'Priya Sharma',
    characterRole: 'Senior ML Engineer',
    estimatedTime: '25-30 min'
  }
];

export default function ScenarioSelector({ onSelectScenario }: ScenarioSelectorProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-[#3D5A80] border-b border-[#293241] shadow-sm">
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
                <p className="text-lg text-[#E0FBFC] font-medium">Choose your adventure in difficult conversations</p>
              </div>
            </div>
            
            {/* Mode Switcher & History Button */}
            <div className="flex flex-col items-end space-y-3">
              {/* Mode Switcher */}
              <div className="flex items-center space-x-2 bg-[#293241] rounded-xl p-1 border-2 border-[#98C1D9]">
                <button
                  className="px-4 py-2 bg-[#98C1D9] text-[#293241] rounded-lg font-bold shadow-md"
                >
                  🎓 Learner
                </button>
                <button
                  onClick={() => window.location.href = '/coach'}
                  className="px-4 py-2 text-[#E0FBFC] hover:bg-[#3D5A80] rounded-lg font-bold transition-colors"
                >
                  👨‍🏫 Coach
                </button>
              </div>

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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Scenario Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-400 transform hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="p-6 pb-4 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{scenario.name}</h3>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{scenario.description}</p>

                {/* Time Estimate */}
                <div className="flex items-center text-xs text-gray-500 mt-auto">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{scenario.estimatedTime}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 border-t border-gray-200 mt-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScenario(scenario.id);
                  }}
                  className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Briefing</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

