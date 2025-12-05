# Pathwise
Product Name: Pathwise
Version: 1.4
Status: Draft


1. Executive Summary
Vision:
Transform executive coaching from episodic engagement to a continuous partnership.
Establish a "Simulation Lab" acting as a force multiplier for human coaches.
Enable assignment of agentic practical "reps" between live sessions.
Provide objective behavioral data to inform coaching strategy.
The Problem:
For Coaches (The "Black Box"):
Limited visibility into client behavior between bi-weekly sessions.
Reliance on subjective client recall ("How did the meeting go?") rather than facts.
Inability to scale high-touch support without burnout.
For Middle Managers (The "Deep End"):
Often promoted without formal training ("frozen middle").
Lack of safe spaces to practice high-stakes conversations.
First attempts at difficult leadership scenarios often happen live, carrying high legal/reputational risk.
The Solution:
AI-Powered "Practice Lab": A safe, high-fidelity and contextual simulation environment.
Infinite Touchpoints: Acts as the coach's "eyes and ears" throughout the week.
Granular Data: Generates objective metrics on behavior, tone, and risk.
Empowerment: allow coaches to start sessions with data-driven insights, not just feelings. Also becomes an easier sell to companies with actual data



2. Target Audience & Personas
Primary Customer: The Executive Coach / L&D Director
Profile: Professional external coach or internal HR Leadership Development head.
Core Value Propositions:
Better Outcomes: Visibility into client failure points under pressure.
Higher Touch: Daily support capability without 24/7 availability.
Differentiation: Offering data-driven coaching vs. purely conversational coaching.
Goal: Assign "Simulator Hours" as homework; utilize data to structure high-impact live sessions.
Primary User: The Middle Manager / Emerging Leader
Profile: Newly promoted managers or directors.
Pain Points:
High anxiety regarding conflict.
Prevalence of "Imposter Syndrome."
Fear of legal missteps (e.g., bias, harassment triggers).
Goal: Practice difficult situations and conversations repeatedly to build muscle memory under guidance and allow your coach to get feedback on how you are doing more frequently so your sessions can be more productive



3. Functional Requirements
3.1 Context Injection Engine (RAG)
Concept: "Policy-Based RAG" (ingesting rules, not PII).
Requirement: System must accept specific document types to "prime" the simulation.
Information Needed:
A. The Role Description (Safe): e.g - Senior Engineer Level 4
B. The Situation Brief (User Generated): User-typed context (e.g - have many performance evaluations coming up) 
C. Company Context 
The Employee Handbook: Legal constraints (PIP policies, forbidden terminology).
D. Coaching Context
The Competency Matrix: Rubric defining specific behavioral tiers.
Tone/Culture Guide (Safe): Company communication style (e.g., "Radical Candor" vs. "Polite Consensus").



3.2 The Simulation Arena (Multi-Agent Environment)
Scenario Focus: "The Performance Review" (The Awkward Conversation).
Core Personas (Synthetic):
Agent 1: The "Problem" Employee:
Generated based on "Situation Brief."
Traits: Defensive, blame-deflecting, emotionally manipulative.
Agent 2: The HR Business Partner:
Silent observer role.
Traits: Monitors for legal liabilities/bias based on "Employee Handbook."
"Shadow Channel" Logic:
Mechanism: Asynchronous "whispers" or hidden thoughts.
Example Flow:
User: "You're just not fitting in."
Employee (Hidden): "Sounds like bias. Noting for HR."
HR Agent (Hidden): "Flag: Subjective language. Risk +10."



3.3 Coach Dashboard (Real-Time Analytics)
Requirement: Split-screen interface (Chat Left / Dashboard Right).
Visual Elements:
Shadow Feed: Real-time log of HR flags and Employee hidden state.
Live Metrics:
Psychological Safety: (Shut-down indicators).
Legal Risk: (Banned word usage).
Clarity of Feedback: (Specificity vs. vagueness).
Performance: Latency < 2 seconds for state updates.


3.4 The Coach’s Report (The "Money" Feature)
Requirement: Automated "Game Tape" analysis for the human coach.
Primary Deliverable: Downloadable PDF "Homework Grade."
Key Metrics:
"The Cringe List": Timestamps of top 3 detrimental user statements.
Behavioral Drift: Analysis of calmness vs. triggered reactions.
Outcome: Final result (e.g., PIP signed vs. resignation threat).










4. Non-Functional Requirements
Scalability: Support concurrent simulations (<3s per agent response).
Data Privacy:
"Zero-Retention" Mode: Session docs processed then discarded.
No PII: Explicit prompts to use pseudonyms (e.g., "Call them Alex").
Reliability: Validation of metrics to prevent hallucinated scores.
5. Technical Architecture
Frontend: React.js, Tailwind CSS (Responsive).
Backend: Python (FastAPI).
AI Stack:
Orchestration: LangChain / LangGraph.
LLM: Gemini 1.5 Flash (Speed).
Logic: Specialized "Critic" prompts for HR Agent.
Database:
Firestore (Session logs).
Vector DB (RAG documents).



6. Success Metrics (KPIs)
Engagement: Avg. >10 turns per review (breaking surface politeness)
Retention: % of managers replaying scenarios for better scores
Coach Adoption: % of coaches referencing reports in billing/updates



7. Product Roadmap
Phase 1: MVP (Alpha)
One Scenario for having a difficult performance review
Coach Dashboard for one client 


Phase 2: Beta (Validation)
Expanded Library of Scenarios: "The Layoff," "Promotion Denial etc 
Expanded context integration - Calendar, emails etc 
AI-powered executive coaching simulation tool - Local MVP
