import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_RECORDING_MS = 12000;
const MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
];

export default function useSpeechInput({ setText, API_BASE }) {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const currentTextRef = useRef('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    setIsSupported(Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder));
    return () => {
      window.clearTimeout(timerRef.current);
      recorderRef.current?.stop?.();
      streamRef.current?.getTracks?.().forEach((track) => track.stop());
    };
  }, []);

  const getMimeType = () => (
    MIME_TYPES.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || ''
  );

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const appendTranscript = useCallback((transcript) => {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript) return;

    setText((prev) => {
      const base = (prev || currentTextRef.current || '').replace(/\s+$/g, '');
      const combined = base ? `${base} ${cleanTranscript}` : cleanTranscript;
      currentTextRef.current = combined;
      return combined;
    });
  }, [setText]);

  const getFriendlyError = (message) => {
    if (message?.includes('Permission denied') || message?.includes('NotAllowedError')) {
      return 'Microphone permission is blocked. Allow microphone access from the browser address bar.';
    }
    if (message?.includes('NotFoundError')) {
      return 'No microphone was detected. Check your input device and try again.';
    }
    return message || 'Voice input failed. Please try again.';
  };

  const transcribeBlob = useCallback(async (blob) => {
    if (!blob?.size) {
      setSpeechError('I did not catch any audio. Try speaking again.');
      return;
    }

    const formData = new FormData();
    const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
    formData.append('file', blob, `voice-message.${extension}`);

    setIsTranscribing(true);
    setSpeechError('');
    try {
      const response = await fetch(`${API_BASE}/chat/transcribe`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || 'Voice transcription failed. Please try again.');
      }

      appendTranscript(data.text || '');
    } catch (error) {
      setSpeechError(getFriendlyError(error.message));
    } finally {
      setIsTranscribing(false);
    }
  }, [API_BASE, appendTranscript]);

  const stopListening = useCallback(() => {
    window.clearTimeout(timerRef.current);
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setSpeechError('Voice input is not supported in this browser.');
      return;
    }

    if (!window.isSecureContext) {
      setSpeechError('Voice input needs localhost or HTTPS. Open the app from http://localhost:3000 or an HTTPS domain.');
      return;
    }

    setSpeechError('');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setSpeechError('Voice recording failed. Please try again.');
        setIsRecording(false);
        cleanupStream();
      };

      recorder.onstop = () => {
        setIsRecording(false);
        cleanupStream();
        const type = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        transcribeBlob(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setTimeout(stopListening, MAX_RECORDING_MS);
    } catch (error) {
      setIsRecording(false);
      cleanupStream();
      setSpeechError(getFriendlyError(error.name || error.message));
    }
  }, [cleanupStream, stopListening, transcribeBlob]);

  const toggleListening = useCallback(() => {
    if (isRecording) stopListening();
    else if (!isTranscribing) startListening();
  }, [isRecording, isTranscribing, startListening, stopListening]);

  const setCurrentText = useCallback((value) => {
    currentTextRef.current = value;
  }, []);

  return {
    isListening: isRecording || isTranscribing,
    isSupported,
    speechError,
    toggleListening,
    stopListening,
    setCurrentText,
  };
}
