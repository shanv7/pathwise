import type { Metrics } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: Metrics;
  messageCount: number;
}

export default function StatsModal({ isOpen, onClose, metrics, messageCount }: StatsModalProps) {
  if (!isOpen) return null;

  const getScoreColor = (score: number, inverse = false) => {
    const adjustedScore = inverse ? 100 - score : score;
    if (adjustedScore >= 70) return 'text-green-600';
    if (adjustedScore >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number, inverse = false) => {
    const adjustedScore = inverse ? 100 - score : score;
    if (adjustedScore >= 70) return 'bg-green-100';
    if (adjustedScore >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Your Performance Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Conversation Summary</h3>
            <p className="text-blue-800">
              You've exchanged <strong>{messageCount}</strong> message{messageCount !== 1 ? 's' : ''} in this performance review.
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">How You're Doing</h3>

            {/* Psychological Safety */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Psychological Safety</span>
                </div>
                <span className={`font-bold text-lg ${getScoreColor(metrics.psychologicalSafety)}`}>
                  {Math.round(metrics.psychologicalSafety)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.psychologicalSafety >= 70 ? 'bg-green-500' :
                    metrics.psychologicalSafety >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.psychologicalSafety}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {metrics.psychologicalSafety >= 70 ? 'You feel safe and respected in this conversation.' :
                 metrics.psychologicalSafety >= 40 ? 'The conversation feels somewhat uncomfortable.' :
                 'You may be feeling threatened or defensive.'}
              </p>
            </div>

            {/* Legal Compliance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-gray-700">Legal Compliance</span>
                </div>
                <span className={`font-bold text-lg ${getScoreColor(metrics.legalCompliance)}`}>
                  {Math.round(metrics.legalCompliance)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.legalCompliance >= 70 ? 'bg-green-500' :
                    metrics.legalCompliance >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.legalCompliance}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {metrics.legalCompliance >= 70 ? 'The conversation is fair and professional.' :
                 metrics.legalCompliance >= 40 ? 'Some potentially problematic statements detected.' :
                 'Significant concerns about fairness or bias.'}
              </p>
            </div>

            {/* Clarity of Feedback */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Clarity of Feedback</span>
                </div>
                <span className={`font-bold text-lg ${getScoreColor(metrics.clarityOfFeedback)}`}>
                  {Math.round(metrics.clarityOfFeedback)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.clarityOfFeedback >= 70 ? 'bg-green-500' :
                    metrics.clarityOfFeedback >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.clarityOfFeedback}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {metrics.clarityOfFeedback >= 70 ? 'The feedback is specific and actionable.' :
                 metrics.clarityOfFeedback >= 40 ? 'The feedback could be more specific.' :
                 'The feedback is vague and hard to act on.'}
              </p>
            </div>
          </div>

          {/* Interpretation Guide */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What Do These Metrics Mean?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Psychological Safety:</strong> How comfortable and respected you feel in this conversation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Legal Compliance:</strong> How well the conversation adheres to legal and professional standards</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Clarity of Feedback:</strong> How specific and actionable the feedback is</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
