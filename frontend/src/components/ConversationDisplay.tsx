import './ConversationDisplay.css';

export interface ConversationTurn {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}

interface ConversationDisplayProps {
  turns: ConversationTurn[];
}

export default function ConversationDisplay({ turns }: ConversationDisplayProps) {
  return (
    <div className="conversation-display">
      <h2 className="conversation-title">Conversation</h2>
      <div className="conversation-messages">
        {turns.length === 0 ? (
          <div className="empty-state">No messages yet. Start recording to begin!</div>
        ) : (
          turns.map((turn, index) => (
            <div
              key={index}
              className={`message ${turn.speaker === 'user' ? 'message-user' : 'message-agent'}`}
            >
              <div className="message-header">
                <span className="message-speaker">
                  {turn.speaker === 'user' ? 'You' : 'Agent'}
                </span>
                <span className="message-time">
                  {new Date(turn.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{turn.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

