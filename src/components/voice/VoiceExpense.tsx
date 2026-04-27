'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function VoiceExpense() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      parseAndSave(text);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const parseAndSave = async (text: string) => {
    // Simple parse: find amount (first number), use rest as description
    const amountMatch = text.match(/(\d+\.?\d*)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const description = text.replace(/(\d+\.?\d*)/, '').trim();
    if (!amount) return alert('No amount found in: ' + text);
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description, date: new Date().toISOString() }),
    });
    alert(`Added expense: $${amount} – ${description || '(no description)'}`);
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm max-w-md">
      <h3 className="font-semibold mb-2">Voice‑to‑Text Expense</h3>
      <Button onClick={toggle} variant={listening ? 'destructive' : 'default'}>
        {listening ? 'Stop Recording' : 'Start Voice Capture'}
      </Button>
      {transcript && (
        <p className="mt-2 text-sm text-gray-700">Heard: “{transcript}”</p>
      )}
    </div>
  );
}
