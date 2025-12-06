import { useState } from 'react';

// Types matching backend scenario structure
interface OrgContext {
  companyName: string;
  companySize: string;
  industry: string;
  teamName: string;
  teamSize: number;
  recentEvents: string[];
  performanceHistory: string;
}

interface CharacterBio {
  name: string;
  role: string;
  tenure: string;
  personaType: string;
  motivations: string[];
  stressors: string[];
  priorFeedback: string[];
  identityDimensions?: string;
  personalCircumstances?: string;
  communicationStyle: string;
  triggerPoints: string[];
}

interface SituationBrief {
  whatHappened: string;
  managerGoal: string;
  constraints: string[];
  riskFactors: string[];
}

interface HiddenGoals {
  primaryGoal: string;
  secondaryGoals: string[];
  relationshipGoal: string;
  legalConsiderations: string[];
  idealOutcome: string;
}

interface ScenarioBriefingProps {
  scenarioName: string;
  description: string;
  difficulty: string;
  skillTags: string[];
  orgContext: OrgContext;
  characterBio: CharacterBio;
  situationBrief: SituationBrief;
  hiddenGoals: HiddenGoals;
  objectives: string[];
  onStartScenario: () => void;
  onBack: () => void;
}

export default function ScenarioBriefing({
  scenarioName,
  description,
  difficulty,
  skillTags,
  orgContext,
  characterBio,
  situationBrief,
  hiddenGoals,
  objectives,
  onStartScenario,
  onBack
}: ScenarioBriefingProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: '📋 Mission Brief',
      subtitle: 'The Situation',
      component: (
        <div className="space-y-6">
          {/* Scenario Overview */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{characterBio.name}</h3>
            <p className="text-gray-700">{description}</p>
          </div>

          {/* Organization Context */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="font-semibold text-gray-900">Organization Context</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-gray-900">{orgContext.companyName} ({orgContext.companySize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry:</span>
                <span className="font-medium text-gray-900">{orgContext.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team:</span>
                <span className="font-medium text-gray-900">{orgContext.teamName} ({orgContext.teamSize} people)</span>
              </div>
            </div>
            
            {orgContext.recentEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Recent Events</p>
                <ul className="space-y-2">
                  {orgContext.recentEvents.map((event, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* What Happened */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-semibold text-yellow-900">What Happened</h4>
            </div>
            <p className="text-sm text-yellow-900 leading-relaxed">{situationBrief.whatHappened}</p>
          </div>
        </div>
      )
    },
    {
      title: '👤 Know Your Employee',
      subtitle: `Meet ${characterBio.name}`,
      component: (
        <div className="space-y-6">
          {/* Character Overview */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {characterBio.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{characterBio.name}</h3>
                <p className="text-gray-600">{characterBio.role}</p>
                <p className="text-sm text-gray-500">Tenure: {characterBio.tenure}</p>
              </div>
            </div>
          </div>

          {/* Employee Context - Combined section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-blue-900 text-sm mb-3 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Employee Context</span>
            </h4>
            <ul className="space-y-2">
              {characterBio.motivations.slice(0, 1).map((m, idx) => (
                <li key={`m-${idx}`} className="text-sm text-blue-800 flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{m}</span>
                </li>
              ))}
              {characterBio.stressors.slice(0, 1).map((s, idx) => (
                <li key={`s-${idx}`} className="text-sm text-blue-800 flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{s}</span>
                </li>
              ))}
              <li className="text-sm text-blue-800 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{characterBio.communicationStyle}</span>
              </li>
            </ul>
          </div>

          {/* Prior Feedback History */}
          {characterBio.priorFeedback.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">📜 Prior Feedback History</h4>
              <div className="space-y-2">
                {characterBio.priorFeedback.map((f, idx) => (
                  <p key={idx} className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-3">{f}</p>
                ))}
              </div>
            </div>
          )}

          {/* Legal Constraints / Risk Factors */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h4 className="font-semibold text-red-900 text-sm mb-3 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Legal Constraints / Risk Factors</span>
            </h4>
            <ul className="space-y-2">
              {hiddenGoals.legalConsiderations.slice(0, 3).map((l, idx) => (
                <li key={idx} className="text-sm text-red-800 flex items-start space-x-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '🎯 Your Mission',
      subtitle: 'Objectives',
      component: (
        <div className="space-y-6">
          {/* Primary Objective */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6">
            <h4 className="font-bold text-lg mb-2">🎯 Primary Objective</h4>
            <p className="text-primary-50 leading-relaxed">{hiddenGoals.primaryGoal}</p>
          </div>

          {/* Secondary Objectives */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3">Secondary Objectives</h4>
            <ul className="space-y-2">
              {hiddenGoals.secondaryGoals.map((goal, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-primary-600 font-bold mt-0.5">{idx + 1}.</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ready Check */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-300 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="font-bold text-gray-900 text-lg mb-2">Ready to Begin?</h4>
            <p className="text-sm text-gray-700">Remember: This is a safe space to practice. You'll get real-time coaching throughout.</p>
          </div>
        </div>
      )
    }
  ];

  const currentPageData = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{currentPageData.title.split(' ')[0]}</span>
              <div>
                <h2 className="text-2xl font-bold">{currentPageData.title.substring(2)}</h2>
                <p className="text-primary-100 text-sm">{currentPageData.subtitle}</p>
              </div>
            </div>
            <div className="text-sm bg-white/20 px-4 py-2 rounded-full">
              Page {currentPage + 1} of {pages.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/30 rounded-full h-2 mt-4">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentPageData.component}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 rounded-b-xl flex items-center justify-between">
          <button
            onClick={currentPage === 0 ? onBack : () => setCurrentPage(currentPage - 1)}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{currentPage === 0 ? 'Back to Scenarios' : 'Previous'}</span>
          </button>

          {currentPage === pages.length - 1 ? (
            <button
              onClick={onStartScenario}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 flex items-center space-x-2 text-lg shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Scenario</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

