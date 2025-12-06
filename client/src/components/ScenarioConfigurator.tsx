import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ScenarioConfig {
  // Basic Info
  name: string;
  description: string;
  difficulty: 'novice' | 'intermediate' | 'advanced';
  skillTags: string[];
  coachingFramework: string;

  // Organization Context
  orgContext: {
    companyName: string;
    companySize: string;
    industry: string;
    teamName: string;
    teamSize: number;
    recentEvents: string[];
    performanceHistory: string;
  };

  // Character Bio (The AI Personality Levers!)
  characterBio: {
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
  };

  // Situation
  situationBrief: {
    whatHappened: string;
    managerGoal: string;
    constraints: string[];
    riskFactors: string[];
  };

  // Goals
  hiddenGoals: {
    primaryGoal: string;
    secondaryGoals: string[];
    relationshipGoal: string;
    legalConsiderations: string[];
    idealOutcome: string;
  };

  // Success Criteria
  successCriteria: {
    minTurns: number;
    maxLegalRisk: number;
    minPsychologicalSafety: number;
    minClarityScore: number;
  };
}

export default function ScenarioConfigurator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState<ScenarioConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'character' | 'situation' | 'goals'>('character');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  useEffect(() => {
    fetchScenario();
  }, [id]);

  const fetchScenario = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/scenarios/${id}`);
      const data = await response.json();
      setConfig(data);
      // Initialize difficulty level from config
      if (data.difficulty === 'novice') setDifficultyLevel(1);
      else if (data.difficulty === 'intermediate') setDifficultyLevel(3);
      else setDifficultyLevel(5);
    } catch (error) {
      console.error('Failed to fetch scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement save endpoint
    setTimeout(() => {
      setSaving(false);
      alert('Scenario saved! (Mock - implement real save)');
    }, 1000);
  };

  const handleTestRun = () => {
    navigate(`/coach/scenario/${id}/test`);
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading scenario configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
      {/* Playful Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EE6C4D] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D5A80] rounded-full opacity-5 blur-3xl"></div>
      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-sm border-b-3 border-[#98C1D9] shadow-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/coach')}
                className="group p-3 hover:bg-[#E0FBFC] rounded-xl transition-all transform hover:scale-110 hover:-rotate-6"
              >
                <svg className="w-6 h-6 text-[#3D5A80] group-hover:text-[#EE6C4D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-black text-[#293241]">{config.characterBio.name}</h1>
                <p className="text-sm text-[#3D5A80] font-semibold">🎨 Tweak personalities & prompt levers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-white hover:bg-[#E0FBFC] text-[#3D5A80] border-2 border-[#3D5A80] rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-3 border-[#3D5A80] border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleTestRun}
                className="px-8 py-3 bg-gradient-to-r from-[#EE6C4D] to-[#ff8a73] hover:from-[#ff8a73] hover:to-[#EE6C4D] text-white rounded-xl font-black transition-all transform hover:scale-110 hover:-rotate-1 shadow-xl hover:shadow-2xl flex items-center space-x-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Test Run!</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-6 border-b-2 border-[#98C1D9]">
            {[
              { key: 'character', label: 'Character Personality', icon: '🎭' },
              { key: 'situation', label: 'Situation & Context', icon: '📋' },
              { key: 'goals', label: 'Goals & Outcomes', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-black transition-all border-b-4 transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'border-[#EE6C4D] text-[#EE6C4D] bg-[#EE6C4D] bg-opacity-10'
                    : 'border-transparent text-[#3D5A80] hover:text-[#EE6C4D] hover:bg-[#E0FBFC]'
                } rounded-t-xl`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {activeTab === 'character' && (
          <div className="space-y-6 animate-fade-in">
            {/* Difficulty Slider */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[#98C1D9] p-5 max-w-sm">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-lg">📊</span>
                <h3 className="text-xs font-black text-[#293241] uppercase tracking-wide">Difficulty</h3>
                <div className="bg-[#3D5A80] px-2 py-0.5 rounded-full">
                  <span className="text-white font-bold text-xs">{difficultyLevel} / 5</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((level) => {
                  const isSelected = level <= difficultyLevel;
                  return (
                    <button
                      key={level}
                      onClick={() => {
                        setDifficultyLevel(level);
                        let difficulty: 'novice' | 'intermediate' | 'advanced';
                        if (level <= 2) difficulty = 'novice';
                        else if (level <= 4) difficulty = 'intermediate';
                        else difficulty = 'advanced';
                        setConfig({ ...config, difficulty });
                      }}
                      className={`flex-1 h-2.5 rounded-full transition-all hover:scale-y-150 cursor-pointer ${
                        isSelected 
                          ? level <= 2 ? 'bg-green-500' : level <= 4 ? 'bg-yellow-500' : 'bg-red-500'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              
              <div className="flex justify-between mt-1.5 text-[10px] text-[#3D5A80] font-semibold">
                <span>Easy</span>
                <span>Hard</span>
              </div>
            </div>

            {/* Character Identity */}
            <div className="bg-white rounded-3xl shadow-xl border-3 border-[#98C1D9] p-8 transform hover:scale-[1.01] transition-all">
              <h3 className="text-2xl font-black text-[#293241] mb-6 flex items-center space-x-3">
                <span className="text-4xl">🎭</span>
                <span>Character Identity & Persona</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
                  <input
                    type="text"
                    value={config.characterBio.name}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={config.characterBio.role}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, role: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Persona Type (AI Personality Lever)</label>
                  <select
                    value={config.characterBio.personaType}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, personaType: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="defensive">Defensive - Deflects blame, makes excuses</option>
                    <option value="checked_out">Checked Out - Disengaged, minimal effort</option>
                    <option value="high_performer">High Performer - Confident, expects recognition</option>
                    <option value="hostile">Hostile - Aggressive, confrontational</option>
                    <option value="overwhelmed">Overwhelmed - Stressed, emotional</option>
                    <option value="passive_aggressive">Passive Aggressive - Subtle resistance</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">This controls the AI's core behavioral pattern</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
                  <input
                    type="text"
                    value={config.characterBio.tenure}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, tenure: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>
            </div>

            {/* Communication Style */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>💬</span>
                <span>Communication Style (Prompt Lever)</span>
              </h3>
              
              <textarea
                value={config.characterBio.communicationStyle}
                onChange={(e) => setConfig({
                  ...config,
                  characterBio: { ...config.characterBio, communicationStyle: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="How does this character communicate? e.g., 'Initially polite but quickly becomes defensive when criticized.'"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 This directly controls how the AI responds in conversation. Be specific about tone, patterns, and emotional reactions.
              </p>
            </div>

            {/* Psychological Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motivations */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Motivations (What Drives Them)</span>
                </h4>
                
                {config.characterBio.motivations.map((motivation, idx) => (
                  <div key={idx} className="mb-2 flex items-start space-x-2">
                    <input
                      type="text"
                      value={motivation}
                      onChange={(e) => {
                        const newMotivations = [...config.characterBio.motivations];
                        newMotivations[idx] = e.target.value;
                        setConfig({
                          ...config,
                          characterBio: { ...config.characterBio, motivations: newMotivations }
                        });
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => {
                        const newMotivations = config.characterBio.motivations.filter((_, i) => i !== idx);
                        setConfig({
                          ...config,
                          characterBio: { ...config.characterBio, motivations: newMotivations }
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => setConfig({
                    ...config,
                    characterBio: {
                      ...config.characterBio,
                      motivations: [...config.characterBio.motivations, 'New motivation']
                    }
                  })}
                  className="mt-2 w-full py-2 text-sm text-green-700 hover:bg-green-100 border border-green-300 rounded-lg transition-colors"
                >
                  + Add Motivation
                </button>
              </div>

              {/* Stressors */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Stressors (Current Pressures)</span>
                </h4>
                
                {config.characterBio.stressors.map((stressor, idx) => (
                  <div key={idx} className="mb-2 flex items-start space-x-2">
                    <input
                      type="text"
                      value={stressor}
                      onChange={(e) => {
                        const newStressors = [...config.characterBio.stressors];
                        newStressors[idx] = e.target.value;
                        setConfig({
                          ...config,
                          characterBio: { ...config.characterBio, stressors: newStressors }
                        });
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-red-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => {
                        const newStressors = config.characterBio.stressors.filter((_, i) => i !== idx);
                        setConfig({
                          ...config,
                          characterBio: { ...config.characterBio, stressors: newStressors }
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => setConfig({
                    ...config,
                    characterBio: {
                      ...config.characterBio,
                      stressors: [...config.characterBio.stressors, 'New stressor']
                    }
                  })}
                  className="mt-2 w-full py-2 text-sm text-red-700 hover:bg-red-100 border border-red-300 rounded-lg transition-colors"
                >
                  + Add Stressor
                </button>
              </div>
            </div>

            {/* Trigger Points */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                <span>⚡</span>
                <span>Trigger Points (What Makes Them Defensive - Critical Lever!)</span>
              </h4>
              <p className="text-sm text-purple-800 mb-4">
                These control when the AI becomes defensive, hostile, or shuts down. Very powerful for testing different feedback approaches.
              </p>
              
              {config.characterBio.triggerPoints.map((trigger, idx) => (
                <div key={idx} className="mb-2 flex items-start space-x-2">
                  <input
                    type="text"
                    value={trigger}
                    onChange={(e) => {
                      const newTriggers = [...config.characterBio.triggerPoints];
                      newTriggers[idx] = e.target.value;
                      setConfig({
                        ...config,
                        characterBio: { ...config.characterBio, triggerPoints: newTriggers }
                      });
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-purple-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => {
                      const newTriggers = config.characterBio.triggerPoints.filter((_, i) => i !== idx);
                      setConfig({
                        ...config,
                        characterBio: { ...config.characterBio, triggerPoints: newTriggers }
                      });
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => setConfig({
                  ...config,
                  characterBio: {
                    ...config.characterBio,
                    triggerPoints: [...config.characterBio.triggerPoints, 'New trigger']
                  }
                })}
                className="mt-2 w-full py-2 text-sm text-purple-700 hover:bg-purple-100 border border-purple-300 rounded-lg transition-colors"
              >
                + Add Trigger Point
              </button>
            </div>

            {/* Context (Optional but powerful) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">🌍 Identity & Personal Context (Optional)</h4>
              <p className="text-sm text-blue-800 mb-4">
                These add depth and make responses more realistic. Use for DEI scenarios or when personal circumstances matter.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Identity Dimensions</label>
                  <input
                    type="text"
                    value={config.characterBio.identityDimensions || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, identityDimensions: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white"
                    placeholder="e.g., 'Woman of color in male-dominated field' or 'First-generation immigrant'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Personal Circumstances</label>
                  <input
                    type="text"
                    value={config.characterBio.personalCircumstances || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      characterBio: { ...config.characterBio, personalCircumstances: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white"
                    placeholder="e.g., 'Recently became a parent' or 'Going through divorce'"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Situation & Context Tab */}
        {activeTab === 'situation' && (
          <div className="space-y-6 animate-fade-in">
            {/* Detailed Scenario Context */}
            <div className="bg-white rounded-3xl shadow-xl border-3 border-[#98C1D9] p-8">
              <h3 className="text-2xl font-black text-[#293241] mb-6 flex items-center space-x-3">
                <span className="text-4xl">📋</span>
                <span>Detailed Situation & Context</span>
              </h3>
              
              <div className="space-y-6">
                {/* Full Scenario Description */}
                <div>
                  <label className="block text-sm font-bold text-[#3D5A80] mb-2 uppercase tracking-wide">Full Scenario Background</label>
                  <textarea
                    value={config.situationBrief.whatHappened}
                    onChange={(e) => setConfig({
                      ...config,
                      situationBrief: { ...config.situationBrief, whatHappened: e.target.value }
                    })}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all text-[#293241]"
                    placeholder="Provide the full context of the situation. Include background on the relationship, recent events, and what has led to this conversation..."
                  />
                  <p className="text-xs text-[#3D5A80] mt-2">
                    💡 This is the detailed scenario that sets up the conversation. Be specific about relationships, history, and current circumstances.
                  </p>
                </div>

                {/* Organization Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#3D5A80] mb-2">Company Name</label>
                    <input
                      type="text"
                      value={config.orgContext.companyName}
                      onChange={(e) => setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, companyName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D5A80] mb-2">Industry</label>
                    <input
                      type="text"
                      value={config.orgContext.industry}
                      onChange={(e) => setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, industry: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D5A80] mb-2">Team Name</label>
                    <input
                      type="text"
                      value={config.orgContext.teamName}
                      onChange={(e) => setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, teamName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D5A80] mb-2">Company Size</label>
                    <input
                      type="text"
                      value={config.orgContext.companySize}
                      onChange={(e) => setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, companySize: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
                    />
                  </div>
                </div>

                {/* Manager's Goal */}
                <div>
                  <label className="block text-sm font-bold text-[#3D5A80] mb-2 uppercase tracking-wide">Manager's Goal for This Conversation</label>
                  <textarea
                    value={config.situationBrief.managerGoal}
                    onChange={(e) => setConfig({
                      ...config,
                      situationBrief: { ...config.situationBrief, managerGoal: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all text-[#293241]"
                    placeholder="What is the manager trying to achieve in this conversation?"
                  />
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-[#E0FBFC] rounded-3xl shadow-xl border-3 border-[#98C1D9] p-8">
              <h4 className="font-black text-[#293241] mb-4 flex items-center space-x-2 text-xl">
                <span>📅</span>
                <span>Recent Events & Context</span>
              </h4>
              
              {config.orgContext.recentEvents.map((event, idx) => (
                <div key={idx} className="mb-3 flex items-start space-x-2">
                  <input
                    type="text"
                    value={event}
                    onChange={(e) => {
                      const newEvents = [...config.orgContext.recentEvents];
                      newEvents[idx] = e.target.value;
                      setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, recentEvents: newEvents }
                      });
                    }}
                    className="flex-1 px-4 py-2 border-2 border-[#98C1D9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
                  />
                  <button
                    onClick={() => {
                      const newEvents = config.orgContext.recentEvents.filter((_, i) => i !== idx);
                      setConfig({
                        ...config,
                        orgContext: { ...config.orgContext, recentEvents: newEvents }
                      });
                    }}
                    className="p-2 text-[#EE6C4D] hover:bg-white rounded-xl transition-colors font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => setConfig({
                  ...config,
                  orgContext: {
                    ...config.orgContext,
                    recentEvents: [...config.orgContext.recentEvents, 'New event']
                  }
                })}
                className="mt-2 w-full py-3 text-sm text-[#3D5A80] hover:bg-white border-2 border-[#98C1D9] rounded-xl transition-colors font-bold"
              >
                + Add Recent Event
              </button>
            </div>
          </div>
        )}

        {/* Goals & Outcomes Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6 animate-fade-in">
            {/* Primary Goal */}
            <div className="bg-gradient-to-r from-[#3D5A80] to-[#98C1D9] rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-black mb-4 flex items-center space-x-3">
                <span className="text-4xl">🎯</span>
                <span>Primary Objective</span>
              </h3>
              <textarea
                value={config.hiddenGoals.primaryGoal}
                onChange={(e) => setConfig({
                  ...config,
                  hiddenGoals: { ...config.hiddenGoals, primaryGoal: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30 text-white placeholder-white/60"
                placeholder="What is the main goal the learner should achieve?"
              />
            </div>

            {/* Key Outcomes - 3 Bullets */}
            <div className="bg-white rounded-3xl shadow-xl border-3 border-[#98C1D9] p-8">
              <h3 className="text-2xl font-black text-[#293241] mb-6 flex items-center space-x-3">
                <span className="text-4xl">✨</span>
                <span>Key Outcomes (3 Goals)</span>
              </h3>
              
              <div className="space-y-4">
                {config.hiddenGoals.secondaryGoals.slice(0, 3).map((goal, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#EE6C4D] to-[#ff8a73] rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...config.hiddenGoals.secondaryGoals];
                        newGoals[idx] = e.target.value;
                        setConfig({
                          ...config,
                          hiddenGoals: { ...config.hiddenGoals, secondaryGoals: newGoals }
                        });
                      }}
                      className="flex-1 px-4 py-3 border-2 border-[#98C1D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all text-[#293241] font-medium"
                      placeholder={`Goal ${idx + 1}`}
                    />
                  </div>
                ))}
                
                {config.hiddenGoals.secondaryGoals.length < 3 && (
                  <button
                    onClick={() => setConfig({
                      ...config,
                      hiddenGoals: {
                        ...config.hiddenGoals,
                        secondaryGoals: [...config.hiddenGoals.secondaryGoals, 'New goal']
                      }
                    })}
                    className="w-full py-3 text-[#3D5A80] hover:bg-[#E0FBFC] border-2 border-dashed border-[#98C1D9] rounded-xl transition-colors font-bold"
                  >
                    + Add Goal (up to 3)
                  </button>
                )}
              </div>
            </div>

            {/* Ideal Outcome */}
            <div className="bg-green-50 rounded-3xl shadow-xl border-3 border-green-200 p-8">
              <h4 className="font-black text-green-900 mb-4 flex items-center space-x-2 text-xl">
                <span>🏆</span>
                <span>What Success Looks Like</span>
              </h4>
              <textarea
                value={config.hiddenGoals.idealOutcome}
                onChange={(e) => setConfig({
                  ...config,
                  hiddenGoals: { ...config.hiddenGoals, idealOutcome: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-200 text-green-900"
                placeholder="Describe what a successful conversation outcome would look like..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

