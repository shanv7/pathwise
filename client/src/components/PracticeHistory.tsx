import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistorySession {
  id: string;
  date: string;
  scenarioName: string;
  duration: number; // in minutes
  turnCount: number;
  finalMetrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };
  outcome: 'success' | 'needs_improvement' | 'incomplete';
}

// Mock history data
const MOCK_HISTORY: HistorySession[] = [
  {
    id: '1',
    date: '2025-12-06',
    scenarioName: 'The Defensive Developer',
    duration: 12,
    turnCount: 8,
    finalMetrics: {
      psychologicalSafety: 75,
      legalCompliance: 65,
      clarityOfFeedback: 82,
    },
    outcome: 'success',
  },
  {
    id: '2',
    date: '2025-12-05',
    scenarioName: 'Performance Review Challenge',
    duration: 15,
    turnCount: 10,
    finalMetrics: {
      psychologicalSafety: 65,
      legalCompliance: 75,
      clarityOfFeedback: 70,
    },
    outcome: 'needs_improvement',
  },
  {
    id: '3',
    date: '2025-12-04',
    scenarioName: 'Team Conflict Resolution',
    duration: 10,
    turnCount: 6,
    finalMetrics: {
      psychologicalSafety: 85,
      legalCompliance: 90,
      clarityOfFeedback: 88,
    },
    outcome: 'success',
  },
  {
    id: '4',
    date: '2025-12-03',
    scenarioName: 'Difficult Feedback Session',
    duration: 8,
    turnCount: 5,
    finalMetrics: {
      psychologicalSafety: 55,
      legalCompliance: 65,
      clarityOfFeedback: 60,
    },
    outcome: 'needs_improvement',
  },
  {
    id: '5',
    date: '2025-12-02',
    scenarioName: 'The Defensive Developer',
    duration: 6,
    turnCount: 4,
    finalMetrics: {
      psychologicalSafety: 45,
      legalCompliance: 80,
      clarityOfFeedback: 50,
    },
    outcome: 'incomplete',
  },
];

function PracticeHistory() {
  // Prepare data for trend chart (sorted by date, oldest to newest)
  const trendData = [...MOCK_HISTORY]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => ({
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'Psychological Safety': session.finalMetrics.psychologicalSafety,
      'Legal Compliance': session.finalMetrics.legalCompliance,
      'Clarity of Feedback': session.finalMetrics.clarityOfFeedback,
    }));

  // Get latest session metrics to determine if improvement needed
  const latestSession = MOCK_HISTORY.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const needsImprovement = {
    psychologicalSafety: latestSession.finalMetrics.psychologicalSafety < 75,
    legalCompliance: latestSession.finalMetrics.legalCompliance < 75,
    clarityOfFeedback: latestSession.finalMetrics.clarityOfFeedback < 75,
  };

  const getOutcomeBadge = (outcome: string) => {
    const styles = {
      success: 'bg-green-100 text-green-800 border-green-300',
      needs_improvement: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      incomplete: 'bg-gray-100 text-gray-600 border-gray-300',
    };
    const labels = {
      success: 'Success',
      needs_improvement: 'Needs Improvement',
      incomplete: 'Incomplete',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[outcome as keyof typeof styles]}`}>
        {labels[outcome as keyof typeof labels]}
      </span>
    );
  };

  const getMetricColor = (value: number, metricType: string) => {
    // Higher is better for all metrics
    if (value >= 75) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] to-white">
      {/* Header */}
      <header className="bg-[#3D5A80] shadow-sm border-b border-[#293241]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-10 h-10 rounded-lg" />
                <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-8" />
              </Link>
            </div>
            <Link to="/" className="px-6 py-2 bg-[#293241] hover:bg-[#3D5A80] text-[#E0FBFC] rounded-lg font-medium transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#293241] mb-2">Practice History</h1>
          <p className="text-lg text-gray-600">Review your past coaching simulation sessions and track your progress</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#667eea]">
            <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
            <div className="text-3xl font-bold text-[#293241]">{MOCK_HISTORY.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">Successful</div>
            <div className="text-3xl font-bold text-green-600">
              {MOCK_HISTORY.filter(s => s.outcome === 'success').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">Needs Work</div>
            <div className="text-3xl font-bold text-yellow-600">
              {MOCK_HISTORY.filter(s => s.outcome === 'needs_improvement').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#98C1D9]">
            <div className="text-sm text-gray-600 mb-1">Avg. Duration</div>
            <div className="text-3xl font-bold text-[#3D5A80]">
              {Math.round(MOCK_HISTORY.reduce((acc, s) => acc + s.duration, 0) / MOCK_HISTORY.length)} min
            </div>
          </div>
        </div>

        {/* Performance Trends Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#293241] mb-4">Performance Trends Over Time</h2>
          <p className="text-sm text-gray-600 mb-6">Track your progress across key metrics</p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                stroke="#3D5A80"
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#3D5A80"
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid #98C1D9',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
              <Line
                type="monotone"
                dataKey="Psychological Safety"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Legal Compliance"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Clarity of Feedback"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`flex items-center space-x-3 bg-green-50 rounded-lg border border-green-200 transition-all ${
              needsImprovement.psychologicalSafety
                ? 'p-6 scale-105 border-4 border-green-400 shadow-lg'
                : 'p-4'
            }`}>
              <div className={`bg-green-500 rounded-full ${
                needsImprovement.psychologicalSafety ? 'w-6 h-6' : 'w-4 h-4'
              }`}></div>
              <div>
                <p className={`text-gray-700 font-semibold ${
                  needsImprovement.psychologicalSafety ? 'text-base' : 'text-sm'
                }`}>
                  Psychological Safety
                </p>
                <p className={needsImprovement.psychologicalSafety
                  ? 'text-sm font-extrabold text-red-600'
                  : 'text-xs font-medium text-green-700'
                }>
                  {needsImprovement.psychologicalSafety ? 'Needs Improvement' : 'Good'}
                </p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 bg-red-50 rounded-lg border border-red-200 transition-all ${
              needsImprovement.legalCompliance
                ? 'p-6 scale-105 border-4 border-red-400 shadow-lg'
                : 'p-4'
            }`}>
              <div className={`bg-red-500 rounded-full ${
                needsImprovement.legalCompliance ? 'w-6 h-6' : 'w-4 h-4'
              }`}></div>
              <div>
                <p className={`text-gray-700 font-semibold ${
                  needsImprovement.legalCompliance ? 'text-base' : 'text-sm'
                }`}>
                  Legal Compliance
                </p>
                <p className={needsImprovement.legalCompliance
                  ? 'text-sm font-extrabold text-red-600'
                  : 'text-xs font-medium text-green-700'
                }>
                  {needsImprovement.legalCompliance ? 'Needs Improvement' : 'Good'}
                </p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 bg-blue-50 rounded-lg border border-blue-200 transition-all ${
              needsImprovement.clarityOfFeedback
                ? 'p-6 scale-105 border-4 border-blue-400 shadow-lg'
                : 'p-4'
            }`}>
              <div className={`bg-blue-500 rounded-full ${
                needsImprovement.clarityOfFeedback ? 'w-6 h-6' : 'w-4 h-4'
              }`}></div>
              <div>
                <p className={`text-gray-700 font-semibold ${
                  needsImprovement.clarityOfFeedback ? 'text-base' : 'text-sm'
                }`}>
                  Clarity of Feedback
                </p>
                <p className={needsImprovement.clarityOfFeedback
                  ? 'text-sm font-extrabold text-red-600'
                  : 'text-xs font-medium text-green-700'
                }>
                  {needsImprovement.clarityOfFeedback ? 'Needs Improvement' : 'Good'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {MOCK_HISTORY.map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left: Session Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#293241]">{session.scenarioName}</h3>
                    {getOutcomeBadge(session.outcome)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {session.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {session.turnCount} turns
                    </span>
                  </div>
                </div>

                {/* Right: Metrics */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Psych Safety</div>
                    <div className={`text-2xl font-bold ${getMetricColor(session.finalMetrics.psychologicalSafety, 'psychologicalSafety')}`}>
                      {session.finalMetrics.psychologicalSafety}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Legal Compliance</div>
                    <div className={`text-2xl font-bold ${getMetricColor(session.finalMetrics.legalCompliance, 'legalCompliance')}`}>
                      {session.finalMetrics.legalCompliance}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Clarity</div>
                    <div className={`text-2xl font-bold ${getMetricColor(session.finalMetrics.clarityOfFeedback, 'clarityOfFeedback')}`}>
                      {session.finalMetrics.clarityOfFeedback}
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

export default PracticeHistory;
