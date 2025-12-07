/**
 * Voice Controls Component
 * Provides UI controls for voice interaction with Gemini Live
 */

import React from 'react';

export interface VoiceControlsProps {
  isRecording: boolean;
  isPaused?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording?: () => void;
  onResumeRecording?: () => void;
  disabled?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isRecording,
  isPaused = false,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  disabled = false,
}) => {
  const handleMainClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const handlePauseClick = () => {
    if (isPaused) {
      onResumeRecording?.();
    } else {
      onPauseRecording?.();
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Pause/Resume button - only show when recording */}
      {isRecording && (
        <button
          onClick={handlePauseClick}
          disabled={disabled}
          className={`
            flex items-center justify-center
            w-12 h-12 rounded-full
            transition-all duration-200
            ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            text-white shadow-lg hover:shadow-xl
          `}
          title={isPaused ? 'Resume recording' : 'Pause recording'}
        >
          {isPaused ? (
            // Play icon
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            // Pause icon
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>
      )}

      {/* Main microphone/stop button */}
      <button
        onClick={handleMainClick}
        disabled={disabled}
        className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-full
          transition-all duration-200
          ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600' + (isPaused ? '' : ' animate-pulse')
              : 'bg-blue-500 hover:bg-blue-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          text-white shadow-lg hover:shadow-xl
        `}
        title={isRecording ? 'Stop voice chat' : 'Start voice chat'}
      >
        {isRecording ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}

        {isRecording && !isPaused && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};
