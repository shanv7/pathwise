import { Link, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistorySession {
  id: string;
  date: string;
  scenarioId: string;
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

// Mock history data - would come from backend in real app
const MOCK_HISTORY: HistorySession[] = [
  {
    id: '1',
    date: '2025-12-06',
    scenarioId: 'def-dev-001',
    scenarioName: 'Delivering Difficult Feedback',
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
    scenarioId: 'def-dev-001',
    scenarioName: 'Delivering Difficult Feedback',
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
    scenarioId: 'check-sen-001',
    scenarioName: 'Re-engaging a Disengaged Employee',
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
    scenarioId: 'def-dev-001',
    scenarioName: 'Delivering Difficult Feedback',
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
    scenarioId: 'def-dev-001',
    scenarioName: 'Delivering Difficult Feedback',
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

// Scenario names mapping
const SCENARIO_NAMES: Record<string, string> = {
  'def-dev-001': 'Delivering Difficult Feedback',
  'check-sen-001': 'Re-engaging a Disengaged Employee',
  'hp-bias-001': 'Navigating a Bias Complaint'
};

function ScenarioAnalytics() {
  const { id } = useParams<{ id: string }>();
  const scenarioName = id ? SCENARIO_NAMES[id] : 'Unknown Scenario';

  // Filter history to only this scenario
  const scenarioHistory = MOCK_HISTORY.filter(session => session.scenarioId === id);

  // Get latest session metrics to determine if improvement needed
  const latestSession = scenarioHistory.length > 0
    ? scenarioHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const needsImprovement = latestSession ? {
    psychologicalSafety: latestSession.finalMetrics.psychologicalSafety < 75,
    legalCompliance: latestSession.finalMetrics.legalCompliance < 75,
    clarityOfFeedback: latestSession.finalMetrics.clarityOfFeedback < 75,
  } : {
    psychologicalSafety: false,
    legalCompliance: false,
    clarityOfFeedback: false,
  };

  // Prepare data for trend chart (sorted by date, oldest to newest)
  const trendData = [...scenarioHistory]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => ({
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'Psychological Safety': session.finalMetrics.psychologicalSafety,
      'Legal Compliance': session.finalMetrics.legalCompliance,
      'Clarity of Feedback': session.finalMetrics.clarityOfFeedback,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] to-white">
      {/* Header */}
      <header className="bg-[#3D5A80] shadow-sm border-b border-[#293241]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/coach" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-10 h-10 rounded-lg" />
                <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-8" />
              </Link>
            </div>
            <Link to="/coach" className="px-6 py-2 bg-[#293241] hover:bg-[#3D5A80] text-[#E0FBFC] rounded-lg font-medium transition-colors">
              Back to Clients
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#293241] mb-2">Scenario Analytics</h1>
          <p className="text-lg text-gray-600">{scenarioName}</p>
        </div>

        {scenarioHistory.length === 0 ? (
          // No history yet
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-[#293241] mb-2">No Practice History Yet</h2>
            <p className="text-gray-600 mb-6">
              This scenario hasn't been practiced yet. Start a test run to see analytics here.
            </p>
            <Link
              to={`/coach/scenario/${id}/test`}
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#EE6C4D] to-[#ff8a73] hover:from-[#ff8a73] hover:to-[#EE6C4D] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Start Test Run
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#667eea]">
                <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                <div className="text-3xl font-bold text-[#293241]">{scenarioHistory.length}</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="text-sm text-gray-600 mb-1">Successful</div>
                <div className="text-3xl font-bold text-green-600">
                  {scenarioHistory.filter(s => s.outcome === 'success').length}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="text-sm text-gray-600 mb-1">Needs Work</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {scenarioHistory.filter(s => s.outcome === 'needs_improvement').length}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#98C1D9]">
                <div className="text-sm text-gray-600 mb-1">Avg. Duration</div>
                <div className="text-3xl font-bold text-[#3D5A80]">
                  {Math.round(scenarioHistory.reduce((acc, s) => acc + s.duration, 0) / scenarioHistory.length)} min
                </div>
              </div>
            </div>

            {/* Performance Trends Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#293241] mb-4">Performance Trends Over Time</h2>
              <p className="text-sm text-gray-600 mb-6">Track your progress across key metrics for this scenario</p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default ScenarioAnalytics;
