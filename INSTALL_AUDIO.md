# Audio Setup for Pathwise

## ⚠️ This file is deprecated

Pathwise now uses **Gemini Live API** for real-time bidirectional voice chat. The old Whisper/Piper setup is no longer needed.

## Current Audio Implementation

Pathwise uses Google's Gemini Live API (`gemini-live-2.5-flash-preview-native-audio-09-2025`) which provides:
- Real-time bidirectional audio streaming
- Native audio support (no separate STT/TTS needed)
- Low-latency voice conversations
- Automatic voice activity detection

## Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   GEMINI_LIVE_MODEL=gemini-live-2.5-flash-preview-native-audio-09-2025
   ```
3. That's it! No additional audio tools needed.

## Legacy Audio Mode

The legacy "Record & Send" mode is still available in the frontend but requires backend implementation. For production use, we recommend using Gemini Live mode.

