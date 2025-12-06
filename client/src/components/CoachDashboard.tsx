import { useRef, useEffect, useMemo } from 'react';
import type { ShadowThought, Metrics } from '../types';
import MetricCard from './MetricCard';
import ShadowFeed from './ShadowFeed';

interface CoachDashboardProps {
  shadowThoughts: ShadowThought[];
  metrics: Metrics;
}

export default function CoachDashboard({ shadowThoughts, metrics }: CoachDashboardProps) {
  // Generate coaching recommendations based on metrics
  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'danger'; text: string }[] = [];

    // Psychological Safety recommendations
    if (metrics.psychologicalSafety < 50) {
      recs.push({
        type: 'danger',
        text: '🚨 Employee is defensive! Switch to asking questions instead of making statements.'
      });
    } else if (metrics.psychologicalSafety < 70) {
      recs.push({
        type: 'warning',
        text: '⚠️ Build rapport: Acknowledge their perspective before giving feedback.'
      });
    } else {
      recs.push({
        type: 'success',
        text: '✓ Good safety! Employee is receptive - now is the time for constructive feedback.'
      });
    }

    // Legal Compliance recommendations
    if (metrics.legalCompliance < 40) {
      recs.push({
        type: 'danger',
        text: '🚨 Avoid vague language! Use specific examples with dates and observable behaviors.'
      });
    } else if (metrics.legalCompliance < 70) {
      recs.push({
        type: 'warning',
        text: '⚠️ Be more specific: Use the SBI framework (Situation-Behavior-Impact).'
      });
    }

    // Clarity recommendations
    if (metrics.clarityOfFeedback < 50) {
      recs.push({
        type: 'danger',
        text: '🚨 Feedback is too vague! Provide specific examples and actionable next steps.'
      });
    } else if (metrics.clarityOfFeedback < 70) {
      recs.push({
        type: 'warning',
        text: '⚠️ Add more detail: What exactly should they do differently?'
      });
    }

    return recs;
  }, [metrics]);

  // Prepare action items for next meeting
  const nextMeetingPrep = useMemo(() => {
    const items: string[] = [];

    if (metrics.psychologicalSafety < 60) {
      items.push('Schedule a 1:1 to rebuild trust and understand their perspective');
    }

    if (metrics.legalCompliance < 60) {
      items.push('Document specific examples with dates, times, and observable behaviors');
      items.push('Review company performance management policy');
    }

    if (metrics.clarityOfFeedback < 60) {
      items.push('Create a written performance improvement plan with clear, measurable goals');
      items.push('Identify 2-3 specific behaviors to change and how to measure progress');
    }

    // Check shadow thoughts for red flags
    const recentThoughts = shadowThoughts.slice(-3);
    const hasDefensiveness = recentThoughts.some(t =>
      t.thought.toLowerCase().includes('defensive') ||
      t.thought.toLowerCase().includes('attacked') ||
      t.thought.toLowerCase().includes('unfair')
    );

    if (hasDefensiveness) {
      items.push('Practice active listening: Summarize their concerns before responding');
    }

    if (items.length === 0) {
      items.push('Continue building on the positive momentum from this conversation');
      items.push('Set clear milestones for next check-in');
    }

    return items;
  }, [metrics, shadowThoughts]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gray-800 text-white px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold">Coach Dashboard</h2>
        <p className="text-sm text-gray-300">Real-time insights & action items</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Live Coaching Recommendations */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Right Now: Do This</span>
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm font-medium ${
                  rec.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  rec.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {rec.text}
              </div>
            ))}
          </div>
        </section>

        {/* Live Metrics */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Live Metrics
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <MetricCard
              title="Psychological Safety"
              value={metrics.psychologicalSafety}
              description="Employee's comfort level"
              color={metrics.psychologicalSafety >= 70 ? 'green' : metrics.psychologicalSafety >= 50 ? 'yellow' : 'red'}
            />
            <MetricCard
              title="Legal Compliance"
              value={metrics.legalCompliance}
              description="Legal & professional standards"
              color={metrics.legalCompliance >= 70 ? 'green' : metrics.legalCompliance >= 40 ? 'yellow' : 'red'}
            />
            <MetricCard
              title="Clarity of Feedback"
              value={metrics.clarityOfFeedback}
              description="Specificity & actionability"
              color={metrics.clarityOfFeedback >= 70 ? 'green' : metrics.clarityOfFeedback >= 50 ? 'yellow' : 'red'}
            />
          </div>
        </section>

        {/* Before Next Meeting */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Before Next Meeting</span>
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <ul className="space-y-2">
              {nextMeetingPrep.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shadow Feed */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Shadow Channel
          </h3>
          <ShadowFeed thoughts={shadowThoughts} />
        </section>
      </div>
    </div>
  );
}
